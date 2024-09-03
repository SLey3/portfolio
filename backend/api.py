import hashlib
import json
import os
import uuid
from pathlib import Path
from urllib.parse import quote

import pendulum
from flask import Blueprint, current_app, jsonify, request, send_file
from flask_mail import Message
from marshmallow import ValidationError

from app import db, mail
from models import *  # noqa: F403 | I did this as all models and schemas will be used in this file
from utils.auth import login_required, login_user, logout_user
from utils.cdn import delete_blog_images, patch_blog_images, upload_blog_images
from utils.sql import (
    get_total_blog_posts,
    get_total_project_pages,
    paginate_project_posts,
    show_blog_posts,
)

# Blueprint registration
api = Blueprint("api", __name__)


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

    input_pwd = validated_data["password"]
    hashed_pwd = hashlib.sha256(input_pwd.encode()).hexdigest()

    if hashed_pwd != user.password:
        return jsonify({"error": "Incorrect password."}), 403
    elif validated_data["email"] != user.email:
        return jsonify({"error": "Incorrect username"}), 403

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


@api.post("/newsletter/subscribe")
def newsletter_subscribe():
    """
    subscribe provided email to the newsletter list

    Return:
        200 HTTP status code
    Raises:
        - 400: If no data was provided
        - 403: If schema validation failed
    """
    schema = NewsLetterSchema()
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data received"}), 400

    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    entry = NewsLetterList(**validated_data)

    db.session.add(entry)
    db.session.commit()
    return jsonify({"success": "email subscribed to newsletter!"})


@api.post("/newsletter/send")
@login_required
def newsletter_send():
    """
    API endpoint to send newsletter to all subscribers

    Return:
        A JSON response containing a success message
    Raises:
        - 400: If no data was provided
    """
    schema = NewsLetterSchema(many=True)
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data received"}), 400

    result = db.session.execute(db.select(NewsLetterList).all()).all()

    subscribers = schema.load(result)

    with mail.connect() as conn:
        for subscriber in subscribers:
            body = data["body"]
            quoted_email = quote(subscriber["email"])

            body_with_footer = (
                body
                + f"""
            <br /> <br />
            <a href="http://localhost:5173/newsletter/unsubscribe?e={quoted_email}">
                Unsubscribe from newsletter
            </a>
            """
            )

            msg = Message(
                sender=("Sergio Ley", current_app.config["MAIL_USERNAME"]),
                recipients=[subscriber["email"]],
                subject=data["subject"],
                html=body_with_footer,
            )

            conn.send(msg)

    return jsonify({"success": "all messages successfully sent"})


@api.post("/newsletter/unsubscribe")
def newsletter_unsubscribe():
    """
    Unsubscribes the provided email from the newsletter list.

    Returns:
        A response with status code 200 if the email is successfully unsubscribed.

    Raises:
        400: If no data is received.
        403: If the provided data is invalid.
        404: If the email is not subscribed to the newsletter.
    """
    schema = NewsLetterSchema()
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data received"}), 400

    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    email = db.session.execute(
        db.select(NewsLetterList).filter_by(email=validated_data["email"])
    ).scalar_one_or_none()

    if not email:
        return jsonify({"error": "Email is not subscribed to the newsletter"}), 404

    db.session.delete(email)
    db.session.commit()
    return 200


@api.post("/education/courses")
def get_courses():
    """ """
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
    """ """
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
    """ """
    fields = request.form.get("fields")
    parsed_fields = tuple(json.loads(fields))
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
    """ """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided!"})

    course_id = data["course_id"]

    course = db.session.execute(db.select(Course).filter_by(id=course_id)).scalar()

    name = course.course_name

    db.session.delete(course)
    db.session.commit()

    return jsonify({"success": f"{name} has been deleted!"})


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


@api.post("/image")
def get_image():
    # TODO: once CDN service is up modify this to return the URL of the CDN resource
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    fp = data["fp"]

    return send_file(fp)


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

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        serialized_data = schema.loads(data)
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
    img_name = "image_" + uuid.uuid4().hex + ".png"

    # IMPORTANT TODO: Modify this once I get the CDN service up and running
    current_dir = Path(__file__).resolve().parent
    fp = current_dir / "cdn" / img_name
    img_file.save(fp)
    serialized_data["logo_path"] = str(fp)

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
    fields = request.form.get("fields")
    img_file = request.files.get("file")
    data = request.form.get("other")
    parsed_fields = tuple(json.loads(fields))
    schema = EducationSchema(only=parsed_fields)

    try:
        serialized_data = schema.loads(data)
    except ValidationError as err:
        print("err msgs: ", err.messages)
        return jsonify({"errors": err.messages}), 400

    institute = db.session.execute(
        db.select(Education).filter_by(id=int(serialized_data["id"]))
    ).scalar()

    for field in schema.only:
        match field:
            case "start_date" | "grad_date" | "expected_date":
                parsed_date = pendulum.from_format(
                    serialized_data[field], "MM/YYYY"
                ).format("MMMM Y")

                setattr(institute, field, parsed_date)
            case "logo_path":
                fp = serialized_data["logo_path"]
                os.unlink(fp)

                prefix = "image_"
                unique_id = uuid.uuid4().hex
                img_name = prefix + unique_id + ".png"

                # IMPORTANT TODO: Modify this once I get the CDN service up and running
                current_dir = Path(__file__).resolve().parent
                new_fp = current_dir / "cdn" / img_name
                img_file.save(new_fp)
                setattr(institute, field, str(new_fp))
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

    # delete image. TODO: once CDN is up modify code to delete image from the CDN
    os.unlink(institute.logo_path)

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

    end_date = serialized_data.get("end_date", None)

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

    issue_exp = serialized_data.get("issue_exp", None)

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
    current_page = request.args.get("page", None, int)
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

    end_date = serialized_data.get("end_date", None)

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
    fields = request.form.get("fields")
    parsed_fields = tuple(json.loads(fields))
    schema = ProjectPostSchema(only=parsed_fields)
    data = {key: value for key, value in request.form.items() if key != "fields"}

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    project = db.session.execute(
        db.select(ProjectPost).filter_by(id=int(data["id"]))
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


@api.delete("/api/projects/delete")
@login_required
def delete_project():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data was provided!"})

    project = db.session.execute(
        db.select(ProjectPost).filter_by(id=int(data["id"]))
    ).scalar()

    showcase = db.session.execute(
        db.select(Showcase.project_posts).filter_by(project_id=project.id)
    ).scalar_one_or_none()

    if showcase is not None:
        showcase.remove_project(project)

    db.session.delete(project)
    db.session.commit()

    return jsonify({"success": f"{project.name} has been successfully deleted"})


@api.get("/blog")
def get_blogs():
    total_pages = request.args.get("tp", None, int)
    total_blogs = get_total_blog_posts(db.engine)
    schema = BlogPostSchema(many=True)

    if not total_pages:
        return jsonify({"error": "No data was provided!"}), 400

    blog_posts = show_blog_posts(BlogPost, db.engine, total_pages)

    return jsonify({"blogs": schema.dump(blog_posts), "blog_count": total_blogs})


@api.get("/blog/singular")
def get_blog():
    blog_id = request.args.get("id", None, int)
    editing = request.args.get("edit", None)

    if editing == "true":
        schema = BlogPostSchema()
    else:
        schema = BlogPostSchema(
            exclude=(
                "is_draft",
                "desc",
            )
        )

    if not blog_id:
        return jsonify({"error": "No id was provided"}), 400

    blog_post = db.session.execute(db.select(BlogPost).filter_by(id=blog_id)).scalar()

    return schema.dump(blog_post)


@api.post("/blog/add")
@login_required
def add_blog():
    content = request.form.get("content", type=json.loads)
    title = request.form.get("title")
    desc = request.form.get("desc")
    is_draft = request.form.get("is_draft")
    schema = BlogPostSchema()

    if not any([content, title, desc]):
        return jsonify({"error": "No data was provided!"}), 400

    data = {
        "content": content,
        "title": title,
        "desc": desc,
        "is_draft": is_draft == "true",
    }

    data["content"] = upload_blog_images(data["content"])

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 403

    blog = BlogPost(**serialized_data)

    db.session.add(blog)
    db.session.commit()

    return jsonify({"success": f"Blog was successfully posted!"})


@api.put("/blog/edit")
@login_required
def edit_blog():
    fields = request.form.get("fields")
    raw_fields = tuple(json.loads(fields))
    parsed_fields = tuple(
        filter(lambda x: x not in ["has_image", "img_del", "content", "id"], raw_fields)
    )
    print(parsed_fields)
    schema = BlogPostSchema(only=parsed_fields) if parsed_fields else BlogPostSchema()
    print(schema.only)
    data = {
        key: value
        for key, value in request.form.items()
        if key not in ["fields", "has_image", "img_del"]
    }

    is_draft = data.get("is_draft", None)
    content = data.get("content", None)
    has_img = request.form.get("has_image", False)
    img_del = request.form.get("img_del", False)

    if is_draft:
        data["is_draft"] = is_draft == "true"

    current_blog = db.session.execute(
        db.select(BlogPost).filter_by(id=data["id"])
    ).scalar()

    if content:
        content = json.loads(content)
        if has_img == "True":
            data["content"] = patch_blog_images(content)
        elif img_del == "True":
            delete_blog_images(content)

    if not data.get("title", False):
        data["title"] = current_blog.title

    if not data.get("desc", False):
        data["desc"] = current_blog.desc

    try:
        serialized_data = schema.load(data)
    except ValidationError as err:
        print(err.messages)
        return jsonify({"errors": err.messages}), 403

    if schema.only:
        for field in schema.only:
            serialized_data[field] = json.loads(content)

            setattr(current_blog, field, serialized_data[field])

    if content:
        current_blog.content = serialized_data["content"]

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
    except:
        return "", 500

    try:
        mail.send_message(
            sender=("Sergio Ley", current_app.config["MAIL_USERNAME"]),
            recipients=[data["email"]],
            subject="Message Received",
            body="Thank you for contacting me, your message has been received. I will get back to you soon.",
        )
    except:
        return "", 500

    return jsonify({"success": "Message has been sent!"})
