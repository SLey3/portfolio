import hashlib
import json
import uuid
import ast

import pendulum
from flask import Blueprint, current_app, jsonify, request, redirect
from flask_mail import Message
from marshmallow import ValidationError
from werkzeug.utils import secure_filename

from app import db, mail
from models import *  # noqa: F403 | I did this as all models and schemas will be used in this file
from utils.auth import login_required, login_user, logout_user, verify_auth
from utils.cdn import (
    delete_blog_images,
    delete_image,
    get_file_extension,
    patch_blog_images,
    patch_image,
    upload_blog_images,
    upload_image,
)

from utils.sql import (
    execute_select,
    get_total_blog_posts,
    get_total_project_pages,
    inspect_links,
    paginate_project_posts,
    show_blog_posts,
)
from utils.bool import to_bool

# Blueprint registration
api = Blueprint("api", __name__)


@api.get("/")
def main_page():
    """
    simply redirects people to the main website
    """
    return redirect("https://www.sleylanguren.com")


@api.get("/testing/loginrequired")
@login_required
def login_required_test_url():
    """
    url endpoint to use during backend testing for the login_required decorator
    """
    return "", 200


@api.post("/admin/login")
def admin_login():
    """
    Login API to verify and login administrator.

    This API endpoint is used to authenticate and log in an administrator.
    It expects a JSON payload containing the administrator's email and password.
    The email and password are validated against the database records.
    If the credentials are valid, the administrator is logged in and their information is returned.

    Returns:
        A JSON response containing the administrator's ID, username, email, and authentication status.

    Raises:
        - 404: If the user is not found in the database.
        - 403: If the password or username is incorrect.

    """
    load_schema = AdminSchema(
        only=(
            "email",
            "password",
        )
    )

    dump_schema = AdminSchema(only=("id", "username", "email"))

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data received"}), 400

    try:
        validated_data = load_schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    user = db.session.execute(
        db.select(Admin).filter_by(email=validated_data["email"])
    ).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_pwd = hashlib.sha256(validated_data["password"].encode()).hexdigest()
    result, err_msg = verify_auth(hashed_pwd, validated_data["email"], user)

    if not result:
        return jsonify({"error": err_msg}), 403

    token = login_user(user.username)
    user_dump = dump_schema.dump(user)

    return jsonify({"bearer": token, "user": user_dump})


@api.post("/admin/logout")
@login_required
def admin_logout():
    """
    logout administrator from the session

    Return:
        200 HTTP status code
    """
    logout_user()
    return "", 200


@api.get("/admin/links")
@login_required
def admin_link_inspector():
    """
    Endpoint to inspect all links across all tables in the database.
    It inspects the links
    using the database engine and returns the results in JSON format.
    Returns:
        Response: A JSON response containing the inspection results.
    """
    links = inspect_links(db.engine)
    report = links if len(links) != 0 else "No links found."

    return jsonify({"report": report})


@api.post("/admin/sql")
@login_required
def admin_execute_sql():
    """
    Endpoint to execute SQL queries for administrator.

    This endpoint allows the administrator to execute SQL queries by sending a POST request
    with the query in the request body.

    Returns:
        JSON response containing the result of the SQL query or an error message.

    Request Body:
        {
            "query": "SQL query string"
        }

    Responses:
        200: A JSON object containing the result of the SQL query.
        400: A JSON object with an error message if no data was provided.
        Other: A JSON object with an error message and the corresponding status code if the query execution fails.
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    query_res, query_ok = execute_select(data["query"], db.engine)

    if query_ok != 200:
        return jsonify({"err_msg": query_res}), query_ok
    return jsonify({"res": query_res})


@api.post("/education/courses")
def get_courses():
    """
    Handles POST requests to retrieve courses associated with a specific institute.

    Returns:
        JSON response containing a list of courses associated with the provided institute.
        If no data is provided in the request, returns an error message with a 400 status code.
    """
    schema = CourseSchema(many=True)
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    courses = db.session.execute(
        db.select(Course).filter_by(associated_institute=data["institute"])
    ).scalars()

    return schema.dump(courses)


@api.post("/education/courses/add")
@login_required
def add_course():
    """
    Endpoint to add a new course to the education database.

    Request Body:
        JSON object containing the course details as per the CourseSchema.
    Returns:
        JSON response indicating the success or failure of the operation.
        - On success: {"success": 'Entry: "<course_id>" has been successfully added!'}
        - On failure: {"error": "No data provided"} with status code 400 if no data is provided.
                    {"errors": <validation_errors>} with status code 403 if validation fails.
    """
    schema = CourseSchema()
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    entry = Course(**serialized_data)

    db.session.add(entry)
    db.session.commit()

    return jsonify(
        {
            "success": 'Entry: "{}" has been successfully added!'.format(
                serialized_data["course_id"]
            )
        }
    )


@api.put("/education/courses/edit")
@login_required
def edit_course():
    """
    Edit an existing course with the provided fields.

    This endpoint allows authenticated users to edit specific fields of an existing course.
    The fields to be edited are specified in the request form under the key "fields".

    Returns:
        JSON response indicating success or failure of the update operation.

    Raises:
        ValidationError: If the provided data does not pass validation.

    Request form data:
        fields (str): A JSON string representing a list of fields to be edited.
        Other form data: Key-value pairs corresponding to the fields specified in "fields".

    Response:
        200: A JSON object with a success message if the course is successfully updated.
        403: A JSON object with error messages if validation fails.
    """
    fields = request.form.get("fields")
    parsed_fields = tuple(ast.literal_eval(fields))
    schema = CourseSchema(only=parsed_fields)
    data = {key: value for key, value in request.form.items() if key != "fields"}

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    course = db.session.execute(
        db.select(Course).filter_by(id=int(serialized_data["id"]))
    ).scalar()

    for field in schema.only:
        if field in serialized_data:
            setattr(course, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": f"{course.course_name} has been successfully updated!"})


@api.delete("/education/courses/delete")
@login_required
def delete_course():
    """
    Deletes a course from the database.

    Endpoint: DELETE /education/courses/delete

    Request Body (JSON):
        {
            "course_id": int  # ID of the course to be deleted
        }

    Responses:
        200 OK:
            {
                "success": str  # Success message with the name of the deleted course
            }
        400 Bad Request:
            {
                "error": "No data provided!"  # Error message if no data is provided in the request
            }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided!"}), 400

    course_id = data["course_id"]

    course = db.session.execute(db.select(Course).filter_by(id=course_id)).scalar()

    db.session.delete(course)
    db.session.commit()

    return jsonify({"success": f"{course.course_name} has been deleted!"})


@api.get("/education/institute")
def get_institutes():
    """
    Api endpoint for returning all educational institutes

    Returns:
        - JSON response with all the institutes.
    """
    schema = EducationSchema(many=True)

    institutes = db.session.query(Education).all()

    for institute in institutes:
        if institute.awards != "N/A":
            awards = institute.awards
            awards = awards.split("|")
            institute.awards = awards

    return schema.dump(institutes)


@api.post("/education/institute/add")
@login_required
def institute_add():
    """
    Api endpoint for entry addition to the Education table.

    This API endpoint is used to add an entry to the Education table which contains
    attended or currently attending educational institutes

    :return: JSON response indicating the success or failure of the entry addition
    """
    schema = EducationSchema()
    data = request.form.get("other")
    img_file = request.files.get("file")

    if not data and not img_file:
        return jsonify({"error": "No data provided"}), 400

    try:
        serialized_data = schema.loads(
            data,
            partial=(
                "logo_id",
                "logo_url",
            ),
        )
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    parsed_start_date = pendulum.from_format(
        serialized_data["start_date"], "MM/YYYY"
    ).format("MMMM Y")

    (
        grad_date,
        expected_date,
    ) = (
        serialized_data["grad_date"],
        serialized_data["expected_date"],
    )

    if grad_date != "undefined":
        parsed_end_date = pendulum.from_format(grad_date, "MM/YYYY").format("MMMM Y")
        serialized_data["grad_date"] = parsed_end_date
        serialized_data.pop("expected_date")
    else:
        parsed_end_date = pendulum.from_format(expected_date, "MM/YYYY").format(
            "MMMM Y"
        )
        serialized_data["expected_date"] = parsed_end_date
        serialized_data.pop("grad_date")

    serialized_data["start_date"] = parsed_start_date

    if serialized_data["major"] == "":
        serialized_data.pop("major")

    # create image file
    file_ext = get_file_extension(img_file.mimetype)
    img_name = secure_filename(f"image_{uuid.uuid4().hex}.{file_ext}")
    img_url, img_id = upload_image(img_file, img_name)

    serialized_data["logo_url"] = img_url
    serialized_data["logo_id"] = img_id

    entry = Education(**serialized_data)

    db.session.add(entry)
    db.session.commit()

    return jsonify(
        {
            "success": 'Entry: "{}" has been successfully added!'.format(
                serialized_data["name"]
            )
        }
    )


@api.put("/education/institute/edit")
@login_required
def edit_institute():
    """
    Edit an institute's information.
    This API endpoint allows editing an institute's information.
    It receives the updated fields as form data and the institute's logo as a file. The function performs the following steps:
    1. Parse the fields from the form data.
    2. Load the data using the EducationSchema.
    3. Validate the loaded data.
    4. Retrieve the institute from the database based on the provided ID.
    5. Update the institute's fields based on the loaded data.
    6. Save the updated institute in the database.
    7. Return a JSON response indicating the success of the operation.

    Returns:
        A JSON response indicating the success of the operation.
    """
    fields = tuple(json.loads(request.form.get("fields")))
    img_file = request.files.get("file")
    _data = json.loads(request.form.get("other"))

    schema = EducationSchema(only=fields)
    data = {k: v for k, v in _data.items() if k not in ["logo_url"]}
    try:
        serialized_data = schema.load(data, partial=["logo_url"], unknown="include")
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    institute = db.session.execute(
        db.select(Education).filter_by(id=int(serialized_data["id"]))
    ).scalar()

    for field in fields:
        match field:
            case "start_date" | "grad_date" | "expected_date":
                parsed_date = pendulum.from_format(
                    serialized_data[field], "MM/YYYY"
                ).format("MMMM Y")

                setattr(institute, field, parsed_date)
            case "logo_url":
                file_ext = get_file_extension(img_file.mimetype)
                img_name = secure_filename(f"image_{uuid.uuid4().hex}.{file_ext}")
                new_url, new_id = patch_image(img_file, img_name, institute.logo_id)
                setattr(institute, field, new_url)
                institute.logo_id = new_id
            case _:
                setattr(institute, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": f"{institute.name} was successfully edited!"})


@api.delete("/education/institute/delete")
@login_required
def delete_institute():
    """
    This API endpoint deletes an institute from the education database.

    Returns:
        A JSON response indicating the success or failure of the deletion.
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    institute_id = int(data["institute_id"])

    institute = db.session.execute(
        db.select(Education).filter_by(id=institute_id)
    ).scalar()

    name = institute.name

    res = delete_image(institute.logo_id)

    if not res:
        return "", 500

    db.session.delete(institute)
    db.session.commit()

    return jsonify({"success": f"{name} has been deleted!"})


@api.get("/experience")
def get_experience():
    """
    API endpoint to get all work experiences sorted from oldest to most recent.
    Returns:
        list: A list of work experiences.
    """
    schema = ExperiencePostSchema(many=True)

    # Get and Sort all work experiences from oldest to most recent
    work_experiences = db.session.execute(
        db.select(ExperiencePost).order_by(ExperiencePost.start_date.desc())
    ).scalars()

    return schema.dump(work_experiences)


@api.post("/experience/add")
@login_required
def add_experience():
    """
    This API endpoint is used to add experience to the portfolio website.

    Returns:
        A JSON response indicating the success or failure of adding the experience.
    Raises:
        ValidationError: If there are validation errors in the provided data.
    """
    data = request.get_json(silent=True)
    schema = ExperiencePostSchema()

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    parsed_start_date = pendulum.from_format(
        serialized_data["start_date"], "MM/YYYY"
    ).format("MMMM Y")

    end_date = serialized_data.get("end_date")

    if end_date:
        parsed_end_date = pendulum.from_format(end_date, "MM/YYYY").format("MMMM Y")
        serialized_data["end_date"] = parsed_end_date

    serialized_data["start_date"] = parsed_start_date

    work_experience = ExperiencePost(**serialized_data)

    db.session.add(work_experience)
    db.session.commit()

    return jsonify({"success": f'{serialized_data["name"]} was successfully added'})


@api.put("/experience/edit")
@login_required
def edit_experience():
    """
    This API endpoint is used to edit the experience details.

    Returns:
        A JSON response containing either the edited work experience details or error messages.
    """
    fields = request.form.get("fields")
    parsed_fields = tuple(json.loads(fields))
    data = {key: value for key, value in request.form.items() if key != "fields"}
    schema = ExperiencePostSchema(only=parsed_fields)

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    work_experience = db.session.execute(
        db.select(ExperiencePost).filter_by(id=int(request.form["id"]))
    ).scalar()

    for field in schema.only:
        match field:
            case "start_date" | "end_date":
                parsed_date = pendulum.from_format(
                    serialized_data[field], "MM/YYYY"
                ).format("MMMM Y")

                setattr(work_experience, field, parsed_date)
            case _:
                setattr(work_experience, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": f"{work_experience.name} was successfully edited!"})


@api.delete("/experience/delete")
@login_required
def delete_experience():
    """
    This API endpoint is used to delete a work experience entry from the database.

    Returns:
        A JSON response indicating the success or failure of the deletion.
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    work_experience = db.session.execute(
        db.select(ExperiencePost).filter_by(id=int(data["id"]))
    ).scalar()

    name = work_experience.name

    db.session.delete(work_experience)
    db.session.commit()

    return jsonify({"success": f"{name} was successfully deleted!"})


@api.get("/cert")
def get_cert():
    """
    Get and return a list of work certificates and licenses sorted from oldest to most recent.

    Returns:
        list: A list of work certificates and licenses.
    """
    schema = CertandLicenseSchema(many=True)

    # Get and Sort all work cert/license from oldest to most recent
    certlicenses = db.session.execute(
        db.select(CertandLicense).order_by(CertandLicense.issue_date.desc())
    ).scalars()

    return schema.dump(certlicenses)


@api.post("/cert/add")
@login_required
def add_cert():
    """
    This API Endpoint is used to add a certificate to the database.
    Parameters:
        None
    Returns:
        A JSON response indicating the success or failure of the operation.
    Raises:
        ValidationError: If there are validation errors in the provided data.
    Example Usage:
        response = add_cert()
    """
    data = request.get_json(silent=True)
    schema = CertandLicenseSchema()

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    parsed_issue_date = pendulum.from_format(
        serialized_data["issue_date"], "MM/YYYY"
    ).format("MMMM Y")

    issue_exp = serialized_data.get("issue_exp")

    if issue_exp:
        parsed_exp_date = pendulum.from_format(
            serialized_data["issue_exp"], "MM/YYYY"
        ).format("MMMM Y")
        serialized_data["issue_exp"] = parsed_exp_date

    serialized_data["issue_date"] = parsed_issue_date

    cert = CertandLicense(**serialized_data)

    db.session.add(cert)
    db.session.commit()

    return jsonify({"success": f"{cert.name} was successfully added!"})


@api.put("/cert/edit")
@login_required
def edit_cert():
    """
    This API endpoint is used to edit a certificate by updating its fields with the provided data.

    Returns:
        A JSON response indicating the success or failure of the edit operation.
    Raises:
        ValidationError: If there are validation errors in the provided data.
    """
    fields = request.form.get("fields")
    parsed_fields = tuple(json.loads(fields))
    data = {key: value for key, value in request.form.items() if key != "fields"}
    schema = CertandLicenseSchema(only=parsed_fields)

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    cert = db.session.execute(
        db.select(CertandLicense).filter_by(id=int(request.form["id"]))
    ).scalar()

    for field in schema.only:
        match field:
            case "issue_data" | "issue_exp":
                parsed_date = pendulum.from_format(
                    serialized_data[field], "MM/YYYY"
                ).format("MMMM Y")

                setattr(cert, field, parsed_date)
            case _:
                setattr(cert, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": f"{cert.name} has been successfully edited!"})


@api.delete("/cert/delete")
@login_required
def delete_cert():
    """
    This API endpoint is used to delete a certificate.

    Returns:
        A JSON response indicating the success or failure of the deletion.
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"})

    cert = db.session.execute(
        db.select(CertandLicense).filter_by(id=int(data["id"]))
    ).scalar()

    name = cert.name

    db.session.delete(cert)
    db.session.commit()

    return jsonify({"success": f"{name} was successfully deleted!"})


@api.get("/showcase")
def get_showcase():
    """
    This API endpoint retrieves the showcase data from the database.
    Returns:
        dict: The showcase data.
    """
    schema = ShowcaseSchema()
    showcase = db.session.query(Showcase).first()

    print(schema.dump(showcase))

    return schema.dump(showcase)


@api.post("/showcase/add")
@login_required
def add_showcase():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    project = db.session.execute(
        db.select(ProjectPost).filter_by(name=data["project_name"])
    ).scalar_one_or_none()

    if project is None:
        return (
            jsonify({"error": f"{data['project_name']} is not an existing project"}),
            400,
        )

    showcase = db.session.execute(db.select(Showcase).filter_by(id=1)).scalar()

    showcase.project_posts.append(project)

    db.session.commit()

    return jsonify({"success": f"{project.name} was successfully added to Showcase"})


@api.get("/projects")
def get_projects():
    """
    This API endpoint retrieves a paginated list of projects from the database and returns the serialized data.
    Parameters:
        None
    Returns:
        A JSON response containing the paginated list of projects.
    Raises:
        None
    """
    current_page = request.args.get("page", type=int)
    schema = ProjectPostSchema(many=True)

    if not current_page:
        return jsonify({"error": "No page data was provided!"}), 400

    projects = paginate_project_posts(ProjectPost, db.engine, current_page)

    return schema.dump(projects)


@api.get("/projects/totalpages")
def get_project_totalpages():
    """
    Get the total number of pages for projects.
    Returns:
        dict: A dictionary containing the total number of pages for projects.
    """
    total_pages = get_total_project_pages(db.engine)

    return jsonify({"payload": total_pages})


@api.post("/projects/add")
@login_required
def add_project():
    """
    This API endpoint is used to add a project to the database.
    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    data = request.get_json(silent=True)
    schema = ProjectPostSchema()

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    parsed_start_date = pendulum.from_format(
        serialized_data["start_date"], "MM/YYYY"
    ).format("MMMM Y")

    end_date = serialized_data.get("end_date")

    if end_date:
        parsed_end_date = pendulum.from_format(end_date, "MM/YYYY").format("MMMM Y")
        serialized_data["end_date"] = parsed_end_date

    serialized_data["start_date"] = parsed_start_date

    project = ProjectPost(**serialized_data)

    db.session.add(project)
    db.session.commit()

    return jsonify({"success": f"{serialized_data['name']} was successfully added!"})


@api.put("/projects/edit")
@login_required
def edit_projects():
    fields = tuple(json.loads(request.form.get("fields")))
    schema = ProjectPostSchema(only=fields)
    data = {key: value for key, value in request.form.items() if key != "fields"}

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    project = db.session.execute(
        db.select(ProjectPost).filter_by(id=int(serialized_data["id"]))
    ).scalar()

    for field in schema.only:
        match field:
            case "start_date" | "end_date":
                parsed_field = pendulum.from_format(
                    serialized_data[field], "MM/YYYY"
                ).format("MMMM Y")

                setattr(project, field, parsed_field)
            case _:
                setattr(project, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": f"{project.name} has been successfully updated!"})


@api.delete("/projects/delete")
@login_required
def delete_project():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    project = db.session.execute(
        db.select(ProjectPost).filter_by(id=int(data["id"]))
    ).scalar()

    showcase = (
        db.session.query(Showcase)
        .filter(Showcase.project_posts.any(ProjectPost.id == project.id))
        .one_or_none()
    )

    if showcase is not None:
        showcase.remove_project(project)

    db.session.delete(project)
    db.session.commit()

    return jsonify({"success": f"{project.name} has been successfully deleted"})


@api.get("/blog")
def get_blogs():
    total_pages = request.args.get("tp", type=int)
    total_blogs = get_total_blog_posts(db.engine)
    schema = BlogPostSchema(many=True)

    if not total_pages:
        return jsonify({"error": "No data was provided!"}), 400

    if total_blogs == 0:
        return jsonify({"bypass": "No blogs exists currently."}), 204

    blog_posts = show_blog_posts(BlogPost, db.engine, total_pages)

    return jsonify({"blogs": schema.dump(blog_posts), "blog_count": total_blogs})


@api.get("/blog/singular")
def get_blog():
    blog_id = request.args.get("id", type=int)
    editing = request.args.get("edit", type=to_bool)

    if not blog_id:
        return jsonify({"error": "No id was provided"}), 400

    if editing:
        schema = BlogPostSchema()
    else:
        schema = BlogPostSchema(exclude=("desc",))

    blog_post = db.session.execute(db.select(BlogPost).filter_by(id=blog_id)).scalar()

    return schema.dump(blog_post)


@api.get("/blog/drafts")
@login_required
def get_blog_drafts():
    schema = BlogPostSchema(
        many=True,
        only=(
            "id",
            "title",
            "created_at",
            "desc",
        ),
    )

    blogs = db.session.execute(
        db.select(BlogPost)
        .filter_by(is_draft=True)
        .order_by(BlogPost.created_at.desc())
    ).scalars()

    if not blogs:
        return "", 204

    return schema.dump(blogs)


@api.post("/blog/add")
@login_required
def add_blog():
    content = request.form.get("content", type=json.loads)
    title = request.form.get("title")
    desc = request.form.get("desc")
    is_draft = request.form.get("is_draft")
    schema = BlogPostSchema()

    print(f"content: {content}", f"title: {title}", f"desc: {desc}", sep="\n")

    if not all([content, title, desc]):
        return jsonify({"error": "No data was provided!"}), 400

    data = {
        "content": content,
        "title": title,
        "desc": desc,
        "is_draft": to_bool(is_draft),
    }

    content = upload_blog_images(data["content"])
    data["content"] = json.dumps(content)

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    blog = BlogPost(**serialized_data)

    db.session.add(blog)
    db.session.commit()

    return jsonify({"success": "Blog was successfully posted!"})


@api.put("/blog/edit")
@login_required
def edit_blog():
    fields = request.form.get("fields")
    raw_fields = tuple(json.loads(fields))
    parsed_fields = tuple(
        filter(lambda x: x not in ["has_img", "img_del", "id"], raw_fields)
    )
    schema = BlogPostSchema(only=parsed_fields) if parsed_fields else BlogPostSchema()
    data = {
        key: value
        for key, value in request.form.items()
        if key not in ["fields", "has_img", "img_del"]
    }

    is_draft = data.get("is_draft")
    content = data.get("content")
    has_img = request.form.get("has_img", False, to_bool)
    img_del = request.form.get("img_del", False, to_bool)

    if is_draft:
        data["is_draft"] = to_bool(is_draft)

    current_blog = db.session.execute(
        db.select(BlogPost).filter_by(id=data.pop("id"))
    ).scalar()

    if content:
        content = json.loads(content)
        if has_img:
            data["content"] = patch_blog_images(content)
        elif img_del:
            cur_data = json.loads(data["cur_data"])
            res = delete_blog_images(cur_data)

            if not res:
                return "", 500

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    if schema.only:
        for field in schema.only:
            if field == "content":
                current_blog.content = json.dumps(content)
            else:
                setattr(current_blog, field, serialized_data[field])

    db.session.commit()
    return jsonify({"success": "Blog has been successfully updated!"})


@api.delete("/blog/delete")
@login_required
def delete_blog():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    blog = db.session.execute(db.select(BlogPost).filter_by(id=data["id"])).scalar()

    res = delete_blog_images(blog.content)

    if not res:
        return (
            jsonify(
                {
                    "error": "Something went wrong with deleting the blog images from the CDN"
                }
            ),
            500,
        )

    db.session.delete(blog)
    db.session.commit()
    return jsonify({"success": "Blog was successfully deleted!"})


@api.post("/contact/send")
def send_contact():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"}), 400

    body = f"""
    New Contact Message Received:
    <hr />
    - Name: {data["name"]}
    <br />
    - Type of Contact: {data["contact_type"] if data["contact_type"] != "default" else "skipped"}
    <br />
    - Email: {data["email"]}
    <br />
    - Body:
    <p style="padding-left: 10px;">{data["msg_body"]}</p>
    """

    msg = Message(
        sender=("Sergio Ley", current_app.config["MAIL_USERNAME"]),
        recipients=[current_app.config["MAIL_USERNAME"]],
        subject=data["msg_subject"],
        html=body,
    )

    try:
        mail.send(msg)
    except Exception:
        return "", 500

    try:
        mail.send_message(
            sender=("Sergio Ley", current_app.config["MAIL_USERNAME"]),
            recipients=[data["email"]],
            subject="Message Received",
            body="Thank you for contacting me, your message has been received. I will get back to you soon.",
        )
    except Exception:
        return "", 500

    return jsonify({"success": "Message has been sent!"})
