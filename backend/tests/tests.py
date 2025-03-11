# imports
import pytest
import json
import random
import string
import base64
from pytest_assert_utils import assert_model_attrs, util
from collections import namedtuple
from itsdangerous.exc import BadSignature
from sqlalchemy import text
from flask import session, current_app


# tests
def test_connection(client, create_engine):
    res = client.head("/education/institute")

    assert res.status_code == 200, "Connection might either not be stable or working"


# login/admin
def test_login(client):
    # test for no data
    res = client.post("/admin/login")

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather: {res.status_code}"
    assert res.json["error"] == "No data received", "Data existence check Failed"

    # test schema
    payload = {"email": "adminadmin.com", "password": "RAYiSGAqjAke7Hdh"}

    res = client.post("/admin/login", json=payload)

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather: {res.status_code}"
    assert {
        "errors": {"email": ["Not a valid email address."]}
    } == res.json, "Not valid json data for schema username invalidation"

    payload["email"] = "admin@admin.com"
    payload["password"] = "123"

    res = client.post("/admin/login", json=payload)

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather: {res.status_code}"
    assert {
        "errors": {"password": ["Length must be between 6 and 20."]}
    }, "Not valid json data for schema password invalidation"

    # test for incorrect password
    payload["password"] = "RAYiSGAqjAke7Hdh"

    res = client.post("/admin/login", json=payload)

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather: {res.status_code}"
    assert res.json["error"] == "Incorrect Password", "Incorrect Auth Failed Message"

    # test for incorrect username
    payload["email"] = "google@google.com"

    res = client.post("/admin/login", json=payload)

    assert (
        res.status_code == 404
    ), f"Status code is not 404 as expected  but rather: {res.status_code}"
    assert res.json["error"] == "User not found", "Incorrect error message"

    # test for correct login
    payload["email"] = "admin@admin.com"
    payload["password"] = "RAYiSGAqjAke"
    Model = namedtuple("AdminModel", ["id", "username", "email"])

    configured_model = Model(id=1, username="Administrator", email="admin@admin.com")

    with client:
        res = client.post("/admin/login", json=payload)

        assert (
            res.status_code == 200
        ), f"Status code is not 200 as expected but rather: {res.status_code}"
        assert "token" in session, "Token was not appended to session"
        assert_model_attrs(configured_model, res.json["user"])


def test_login_required(client, user):
    # get make fake bearer token
    choices = list(string.ascii_letters + string.digits)
    random.shuffle(choices)
    randomized_res = random.choices(choices, k=12)

    fakeBearerToken = base64.urlsafe_b64encode(
        "".join(randomized_res).encode()
    ).decode()

    # test without bearer token
    res = client.get("/testing/loginrequired")

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather: {res.status_code}"

    # test with fake bearer token
    res = client.get(
        "/testing/loginrequired", headers={"Authorization": f"Bearer {fakeBearerToken}"}
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather {res.status_code}"

    # test with real bearer token
    res = client.get(
        "/testing/loginrequired", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"


def test_logout(client, user):
    # test
    with client:
        res = client.post("/admin/logout", headers={"Authorization": f"Bearer {user}"})

        assert (
            res.status_code == 200
        ), f"Status code is not 200 as expected but rather {res.status_code}"
        assert "token" not in session, "Token is still in session"


def test_link_inspector(client, datadir, user):
    # test preparation
    expected_data = json.load(datadir["link_inspector.json"].open("r"))

    # test
    res = client.get("/admin/links", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.json["report"] == expected_data
    ), "report data did not match the expected data"


def test_execute_sql(client, datadir, user):
    # test preparation
    expected_data = json.load(datadir["execute_sql.json"].open("r"))

    # test
    # test submission with no data
    res = client.post("/admin/sql", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Error key is not present in the response json"

    # test submission with data with correct query
    res = client.post(
        "/admin/sql",
        json={"query": "* FROM admin"},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"
    assert res.json["res"] == expected_data, "result json did not match expected data"

    # test submission with invalid query (non existent table)
    res = client.post(
        "/admin/sql",
        json={"query": "* FROM yogurt"},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert res.status_code != 200, "Status code is 200"
    assert (
        util.Dict.containing_exactly("err_msg") == res.json
    ), "Result JSON does not contain error message object"


# newsletter
def test_newsletter_subscribe(client):
    # test preparation
    payload = {"email": "testing@test.com"}

    # test submission with no data
    res = client.post("/newsletter/subscribe")

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON does not contain no data error"

    # test submission with invalid email
    res = client.post("/newsletter/subscribe", json={"email": "testingtestcom"})

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather {res.status_code}"
    assert {
        "errors": {"email": ["Not a valid email address."]}
    } == res.json, "Not valid json data for schema email invalidation"

    # test submission with valid email
    res = client.post("/newsletter/subscribe", json=payload)

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"
    assert util.Dict.containing_exactly(
        "success"
    ), "Result JSON does not contain expected key of success"


def test_newsletter_getsubs(client, user):
    # test preparation
    Model = namedtuple("NewsletterGetSubsModel", ["res"])
    configured_model = Model(res=["testing@test.com"])

    # test
    res = client.get("/newsletter/getsubs", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("res") == res.json
    ), "Result JSON does not contain expected key of res"
    assert_model_attrs(configured_model, res.json)


def test_newsletter_draft_operations(client, user):
    # test preparation
    payload = {"content": [{"test": "test content"}], "title": "Test title"}
    Model = namedtuple("NewsletterDraftModel", ["id", "content", "title"])
    configured_model = Model(id=1, **payload)

    # test post request first
    res = client.post(
        "/newsletter/draft", json=payload, headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"

    # test get request
    res = client.get("/newsletter/draft", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"
    assert_model_attrs(configured_model, res.json)

    # test delete request
    res = client.delete(
        "/newsletter/draft", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"

    # test get request with no draft stored
    res = client.get("/newsletter/draft", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 204
    ), f"Status code is not 204 as expected but rather {res.status_code}"


def test_newsletter_send(client, user, mail_outbox):
    # test preparation
    data = {
        "content": "test content",
        "title": "Testing",
    }

    # test with data first
    res = client.post(
        "/newsletter/send", json=data, headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("success") == res.json
    ), "Result JSON does not contain expected key of success"
    assert len(mail_outbox) == 1, "Either it sent to much emails or none were sent."
    assert (
        mail_outbox[0].subject == "Testing"
    ), "Mail subject is not 'Testing' as set by the data title parameter"
    assert util.Str.not_empty() == mail_outbox[0].html, "Mail body was blank"
    assert (
        util.Str.containing("test content") == mail_outbox[0].html
    ), "'test content' was not present in the mail body"

    # test with no data
    res = client.post("/newsletter/send", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON does not contain expected key of error"


# @pytest.mark.skip(
#    reason="Active bug: Token creation causes verification failure in tests."
# )
def test_newsletter_unsubscribe(app_ctx, client):
    # test preparation
    newsletter = pytest.importorskip(
        "backend.utils.newsletter",
        reason="Module could not be imported due to module or import error",
    )

    newsletter.init_serializer_and_salt(current_app)
    token = newsletter.generate_unsubscribe_token("testing@test.com")

    # test with correct token
    res = client.delete("/newsletter/unsubscribe", query_string={"t": token})

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert util.Dict.containing_exactly(
        "success"
    ), "Result JSON does not contain expected key of success"

    # test without token
    res = client.delete("/newsletter/unsubscribe")

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON does not contain expected key of error"

    # test with malformated token mocking as expired
    with pytest.raises(BadSignature):
        res = client.delete("/newsletter/unsubscribe", query_string={"t": "123abc"})

    # test with invalid token
    res = client.delete(
        "/newsletter/unsubscribe", query_string={"t": "123abc.zien.duecb89d"}
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("expired") == res.json
    ), "Result JSON does not contain expected key of expired"


def test_get_course(client):
    # test preparation
    Model = namedtuple(
        "CourseModel",
        [
            "id",
            "course_name",
            "course_id",
            "course_url",
            "associated_institute",
            "desc",
        ],
    )
    configured_model = Model(
        id=1,
        course_name="Example Course",
        course_id="EX-101",
        course_url="https://example.com/",
        associated_institute="Educational Institute",
        desc="This is an example course!",
    )

    payload = {"institute": "Educational Institute"}

    # test without sending data first
    res = client.post("/education/courses")

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON does not contain expected key of error"

    # test with sending data
    res = client.post("/education/courses", json=payload)

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert_model_attrs(configured_model, res.json[0])


def test_add_course(client, user, datadir):
    # first test with no data
    res = client.post(
        "/education/courses/add", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON does not contain expected key of 'error'"

    # test with data invalidation
    res = client.post(
        "/education/courses/add",
        json={
            "id": 2,
            "course_name": "E",
            "course_id": "E",
            "course_url": "smthngcom|",
            "associated_institute": "E",
        },
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 but rather {res.status_code}"
    assert (
        util.Dict().containing_only(
            errors={
                "course_url": ["Not a valid URL."],
                "desc": ["Missing data for required field."],
            }
        )
        == res.json
    ), "Result JSON does not contain expected keys of either 'errors' or 'course_url' or 'desc"

    # test with correct data
    res = client.post(
        "/education/courses/add",
        json=json.load(datadir["course.json"].open("r"))["add"],
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"status code is not 200 but rather {res.status_code}"
    assert (
        util.Dict().containing_exactly(
            success='Entry: "EX-102" has been successfully added!'
        )
        == res.json
    ), "Result JSON does not contain expected key and exact data of 'success'"


def test_edit_course(client, user, datadir, sa_engine):
    # test preparation
    course_json = json.load(datadir["course.json"].open("r"))["edit"]["input"]
    Model = namedtuple(
        "EditCourseModel",
        [
            "id",
            "course_name",
            "course_id",
            "course_url",
            "associated_institute",
            "desc",
        ],
    )
    configured_model = Model(
        id=2,
        course_name=course_json["course_name"],
        course_id=course_json["course_id"],
        course_url="https://example.com/2",
        associated_institute="Educational Institute",
        desc="Another Small desc",
    )

    CURLModel = namedtuple(
        "CourseUrlModel", "errors", defaults=({"course_url": ["Not a valid URL."]},)
    )

    validation_err_payload = {
        "fields": "['id', 'course_url']",
        "course_url": "smthngcom|",
    }

    # test
    res = client.put(
        "/education/courses/edit",
        data=course_json,
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(success="EC has been successfully updated!")
        == res.json
    ), "Result JSON content did not match expected content"

    # verify changes made
    with sa_engine.begin() as conn:
        res = (
            conn.execute(
                text(
                    "SELECT * FROM course WHERE associated_institute='Educational Institute' AND id=2"
                )
            )
            .mappings()
            .first()
        )

    assert_model_attrs(configured_model, res)

    # test raising validation error
    res = client.put(
        "/education/courses/edit",
        data=validation_err_payload,
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather: {res.status_code}"
    assert_model_attrs(CURLModel(), res.json)


def test_delete_course(client, user):
    # test delete
    res = client.delete(
        "/education/courses/delete",
        json={"course_id": 2},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(success="EC has been deleted!") == res.json
    ), "Result JSON content did not match expected content"

    # test no data
    res = client.delete(
        "/education/courses/delete", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Result JSON content did not have expected key of 'error'"


# education
def test_get_educational_institutes(client):
    Model = namedtuple(
        "Institution_Model",
        [
            "id",
            "name",
            "start_date",
            "grad_date",
            "institute_type",
            "awards",
            "major",
            "degree",
            "expected_date",
            "logo_url",
            "logo_id",
            "institute_url",
            "small_desc",
            "created_at",
        ],
    )

    # Instantiate the model with default test data
    configured_model = Model(
        id=1,
        name="Educational Institute",
        start_date="August 2023",
        grad_date="May 2027",
        institute_type="University",
        awards="['STEM Scholar', 'Educational Leaders']",
        major="Computer Science",
        degree="Bachelors of Science",
        expected_date=None,
        logo_url="https://ik.imagekit.io/8jh2j8rnw/imgs/image_e7b84438073c4387ba924679de7a2a24_L1AGBNS_J.jpg",
        logo_id="66e388efe375273f601a81f6",
        institute_url="https://example.com/",
        small_desc="Educational Institute is a private liberal arts college.",
        created_at="September 12, 2024 11:32:08 PM UTC",
    )

    res = client.get("/education/institute")

    assert_model_attrs(configured_model, res.json[0])


def test_add_education(client, user, datadir):
    # test preparation
    education_json = json.load(datadir["education.json"].open("r"))["add"]
    EIURLModel = namedtuple(
        "EducationIncorrectUrlModel",
        "errors",
        defaults=({"institute_url": ["Not a valid URL."]},),
    )
    IITModel = namedtuple(
        "IncorrectInstituteTypeModel",
        "errors",
        defaults=(
            {
                "institute_type": [
                    '"Elementary School" is not a valid institution type.'
                ]
            },
        ),
    )

    # first test with no data
    res = client.post(
        "/education/institute/add", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 as expected but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly("error") == res.json
    ), "Expected JSON did not contain expected key of 'error'"

    # test with data (with grad date)
    res = client.post(
        "/education/institute/add",
        data={
            "other": json.dumps(education_json["w_grad_d_n_expected"]),
            "file": datadir["imgs/2nd_Educational_Institute.png"].open("rb"),
        },
        headers={"Authorization": f"Bearer {user}"},
    )
    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather: {res.status_code}"
    assert (
        util.Dict.containing_only(
            success=f'Entry: "{education_json["w_grad_d_n_expected"]["name"]}" has been successfully added!'
        )
        == res.json
    )

    # test with data (with expected)
    res = client.post(
        "/education/institute/add",
        data={
            "other": json.dumps(education_json["n_grad_d_w_expected"]),
            "file": datadir["imgs/3rd_Educational_Institute.jpg"].open("rb"),
        },
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 as expected but rather: {res.status_code}"
    assert (
        util.Dict.containing_only(
            success=f'Entry: "{education_json["n_grad_d_w_expected"]["name"]}" has been successfully added!'
        )
        == res.json
    )

    # test with data containing incorrect url format
    res = client.post(
        "/education/institute/add",
        data={
            "other": json.dumps(education_json["incorrect_url"]),
            "file": datadir["imgs/3rd_Educational_Institute.jpg"].open("rb"),
        },
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather {res.status_code}"
    assert_model_attrs(EIURLModel(), res.json)

    # test with data containing incorrect_institute
    res = client.post(
        "/education/institute/add",
        data={
            "other": json.dumps(education_json["incorrect_institute"]),
            "file": datadir["imgs/3rd_Educational_Institute.jpg"].open("rb"),
        },
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 as expected but rather {res.status_code}"
    assert_model_attrs(IITModel(), res.json)


def test_edit_education(client, user, datadir, sa_engine):
    # test preparation
    education_edit_json = json.load(datadir["education.json"].open("r"))["edit"]
    Model = namedtuple(
        "InstituteEditModel",
        [
            "id",
            "name",
            "start_date",
            "grad_date",
            "expected_date",
            "institute_type",
            "awards",
            "major",
            "degree",
            "institute_url",
            "small_desc",
            "created_at",
            "logo_url",
            "logo_id",
        ],
        defaults=(0,) * 14,
    )

    # initiate test
    res = client.put(
        "/education/institute/edit",
        data={
            "other": json.dumps(education_edit_json["other"]),
            "fields": json.dumps(education_edit_json["fields"]),
            "file": datadir["imgs/1st_Educational_Edit_Logo.jpeg"].open("rb"),
        },
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code} \n response json: {res.json}"
    assert (
        util.Dict.containing_exactly(
            success="2nd Educational Institute was successfully edited!"
        )
        == res.json
    ), "Requested JSON does not match expected"

    # verify changes made
    with sa_engine.begin() as conn:
        res = (
            conn.execute(text("SELECT * FROM education WHERE id=2")).mappings().first()
        )

        configured_model = Model(
            id=2,
            name="2nd Educational Institute",
            start_date="July 2026",
            grad_date="July 2030",
            expected_date=None,
            institute_type="University",
            awards="Leadership Award | Pompeii Award of Excellence",
            major="Economics",
            degree="Bachelor of Science",
            institute_url="https://example.com",
            small_desc="small description",
            logo_id=res["logo_id"],
            logo_url=res["logo_url"],
            created_at=res["created_at"],
        )

    assert_model_attrs(configured_model, res)


def test_delete_education(client, user):
    # test without data
    res = client.delete(
        "/education/institute/delete", headers={"Authorization": f"Bearer {user}"}
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert util.Dict.containing_exactly(
        error="No data was provided!"
    ), "Result JSON content did not have expected key of 'error'"

    # test full functionality
    res = client.delete(
        "/education/institute/delete",
        json={"institute_id": 2},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code != 500
    ), "Status code was 500 implying deleting institute image failed"
    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert util.Dict.containing_exactly(
        success="2nd Educational Institute has been deleted!"
    )


def test_add_showcase(client, user):
    # test with no data first
    res = client.post("/showcase/add", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(error="No data was provided!") == res.json
    ), "Resulting JSON did not contain expected keyword of 'error'"

    # test with incorrect project name
    res = client.post(
        "/showcase/add",
        json={"project_name": "not exist"},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(error="not exist is not an existing project")
        == res.json
    ), "Resulting JSON did not contain expected keyword of 'error' or did not return expected message"

    # test full functionality
    res = client.post(
        "/showcase/add",
        json={"project_name": "Example Project"},
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert util.Dict.containing_exactly(
        success="Example Project is not an existing project"
    )


def test_get_showcase(client, datadir):
    # test preparation
    comparator = json.load(datadir["get_showcase.json"].open("r"))

    # test full functionality
    res = client.get("/showcase")

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(comparator) == res.json
    ), "Result JSON did not contain the expected data"


def test_get_projects(client, datadir):
    # test preparation
    comparator = json.load(datadir["get_projects.json"].open("r"))

    # test full functionality
    res = client.get("/projects", query_string={"page": 1})

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert comparator == res.json, "Result JSON did not contain the expected data"


def test_get_project_totalpages(client):
    # test full functionality
    res = client.get("/projects/totalpages")

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(payload=1) == res.json
    ), "Result JSON data did not match one page as expected"


def test_add_project(client, user, datadir):
    # test preparation
    project = json.load(datadir["projects.json"].open("r"))["add"]
    PIURLModel = namedtuple(
        "ProjectIncorrectUrlModel",
        "errors",
        defaults=({"project_repo_url": ["Not a valid URL."]},),
    )

    # test request with no data
    res = client.post("/projects/add", headers={"Authorization": f"Bearer {user}"})

    assert (
        res.status_code == 400
    ), f"Status code is not 400 but rather {res.status_code}"
    assert (
        util.Dict.containing_exactly(error="No data was provided!") == res.json
    ), "Result JSON did not contain expected error message"

    # test request with invalid data
    res = client.post(
        "/projects/add",
        json=project["invalid"],
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 403
    ), f"Status code is not 403 but rather {res.status_code}"
    assert_model_attrs(PIURLModel(), res.json)

    # test request with full functionality
    res = client.post(
        "/projects/add",
        json=project["valid"],
        headers={"Authorization": f"Bearer {user}"},
    )

    assert (
        res.status_code == 200
    ), f"Status code is not 200 but rather {res.status_code}"
    assert util.Dict.containing(
        success=f'{project["valid"]["name"]} was successfully added!'
    ), "Result JSON did not contain expected message"
