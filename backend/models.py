from typing import Optional

import pendulum
import sqlalchemy as sa
from marshmallow import validate
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app import db, ma

# get local tz
local_tz = pendulum.local_timezone()


# database models
class Admin(db.Model):
    """
    db model for admin

    params:
        :id: unique id that identifies a row
        :username: username of admin
        :email: email of admin
        :password: password of admin
    """

    __tablename__ = "admin"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(unique=True, nullable=False)


class BlogPost(db.Model):
    """
    db model for blog post entries

    params:
        :id: unique id that identifies a row
        :title: Title of the blog post
        :created_at: date blog post was made
        :content: blog post contents
        :desc: Short description of the blog post
        :is_draft: If blog post is a draft
    """

    __tablename__ = "blog_post"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(unique=True, nullable=False)
    created_at: Mapped[str] = mapped_column(
        default=pendulum.now(local_tz).format("LL LTS zz")
    )
    content: Mapped[str] = mapped_column(nullable=False)
    desc: Mapped[str] = mapped_column(nullable=False, unique=True)
    is_draft: Mapped[bool] = mapped_column(nullable=False, default=False)


class Education(db.Model):
    """
    db model for education entries (e.g. university, high school, etc)

    params:
        :id: unique id that identifies a row
        :name: name of the institute attended
        :start_date: month and year that I started attending
        :grad_date: month and year that I graduated or expect to graduate
        :expected_date: date expected to graduate (if applicable)
        :institute_type: type of institution I attended (e.g. high school, university, etc)
        :awards: Honors & awards received
        :major: name of major (if applicable)
        :degree: type of degree earned or expected
        :logo_url: Img CDN url
        :logo_id: img cdn id
        :institute_url: Url of the website of the institution
        :small_desc: Small description of the institution
        :created_at: date row was created
    """

    __tablename__ = "education"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    start_date: Mapped[str] = mapped_column(unique=True, nullable=False)
    grad_date: Mapped[str] = mapped_column(nullable=False, default="present")
    expected_date: Mapped[Optional[str]] = mapped_column()
    institute_type: Mapped[str] = mapped_column(nullable=False)
    awards: Mapped[str] = mapped_column(nullable=False)
    major: Mapped[Optional[str]] = mapped_column()
    degree: Mapped[str] = mapped_column(nullable=False)
    logo_url: Mapped[str] = mapped_column(nullable=False)
    logo_id: Mapped[str] = mapped_column(nullable=False)
    institute_url: Mapped[str] = mapped_column(unique=True, nullable=False)
    small_desc: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[str] = mapped_column(
        default=pendulum.now(local_tz).format("LL LTS zz")
    )


class Course(db.Model):
    """
    db model for course entries

    params:
        :id: unique id that identifies row
        :course_name: Name of course taken
        :course_id: ID of course (e.g. CS-232)
        :course_url: URL to institute page of the course (if applicable)
        :associated_institute: Institute in which the course comes from
        :desc: description of the course
    """

    __tablename__ = "course"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_name: Mapped[str] = mapped_column(unique=True, nullable=False)
    course_id: Mapped[str] = mapped_column(unique=True, nullable=False)
    course_url: Mapped[Optional[str]] = mapped_column(unique=True)
    associated_institute: Mapped[str] = mapped_column(nullable=False)
    desc: Mapped[str] = mapped_column(unique=True, nullable=False)


class ExperiencePost(db.Model):
    """
    db model for experience entries that follow in the range of jobs,
    internships, and volunteering

    params:
        :id: unique id that identifies a row
        :name: name of place
        :type: type of experience (job, internship, volunteer)
        :position: position I had in the place
        :start_date: month and year I started working in the place
        :end_date: month and year I stopped working in the place
        :desc: description of my role
        :created_at: date row was created
    """

    __tablename__ = "experience_post"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    type: Mapped[str] = mapped_column(nullable=False)
    position: Mapped[str] = mapped_column(nullable=False)
    start_date: Mapped[str] = mapped_column(nullable=False)
    end_date: Mapped[Optional[str]] = mapped_column(default="present")
    desc: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[str] = mapped_column(
        default=pendulum.now(local_tz).format("LL LTS zz")
    )


class CertandLicense(db.Model):
    """
    db model to represent a certification or license.

    params:
        :id: The unique identifier for the certification or license.
        :name: The name of the certification or license.
        :issuing_org: The organization that issued the certification or license.
        :issue_date: The date when the certification or license was issued.
        :issue_exp: The expiration date of the certification or license (if applicable).
        :credential_id: The ID associated with the certification or license (if applicable).
        :credential_url: The URL to the credential associated with the certification or license.
        :created_at: The date and time when the certification or license was created.
    """

    __tablename__ = "cert_and_license"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    issuing_org: Mapped[str] = mapped_column(nullable=False)
    issue_date: Mapped[str] = mapped_column(nullable=False)
    issue_exp: Mapped[Optional[str]] = mapped_column()
    credential_id: Mapped[Optional[str]] = mapped_column()
    credential_url: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[str] = mapped_column(
        default=pendulum.now(local_tz).format("LL LTS zz")
    )


class ProjectPost(db.Model):
    """
    db model for project posts

    params:
        :id: unique id that identifies a row
        :name: name of project
        :start_date: month and year that the project was started
        :end_date: month and year that the project was finished
        :desc: description of the project
        :skills: Skills used in the project (i.e. "python, javascript, React.js, etc")
        :project_repo_url: url to the project repository
        :project_url: url to the projects website (if applicable)
        :created_at: date row was created
    """

    __tablename__ = "project_post"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    start_date: Mapped[str] = mapped_column(nullable=False)
    end_date: Mapped[str] = mapped_column(nullable=True, default="present")
    desc: Mapped[str] = mapped_column(unique=True, nullable=True)
    skills: Mapped[str] = mapped_column(nullable=False)
    project_repo_url: Mapped[str] = mapped_column(unique=True, nullable=False)
    project_url: Mapped[Optional[str]] = mapped_column(unique=True)
    created_at: Mapped[str] = mapped_column(
        default=pendulum.now(local_tz).format("LL LTS zz")
    )


class Showcase(db.Model):
    """
    Represents a showcase of projects.

    Attributes:
        id (int): The unique identifier for the showcase.
        project_posts (list): The list of project posts associated with the showcase.
    """

    __tablename__ = "showcase"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_posts = db.relationship(
        "ProjectPost",
        secondary="project_showcase",
        backref=db.backref("showcase", lazy="dynamic"),
    )

    def remove_project(self, project_post):
        """
        Removes a project post from the showcase.

        Args:
            project_post (ProjectPost): The project post to be removed.
        """
        if project_post in self.project_posts:
            self.project_posts.remove(project_post)


# db Table
project_showcase = db.Table(
    "project_showcase",
    sa.Column(
        "project_id",
        sa.ForeignKey(ProjectPost.id, ondelete="CASCADE"),
        primary_key=True,
    ),
    sa.Column("showcase_id", sa.ForeignKey(Showcase.id), primary_key=True),
)


# model schemas
class AdminSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Admin

    email = ma.auto_field(validate=[validate.Email()])
    password = ma.auto_field(validate=[validate.Length(6, 20)])


class BlogPostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BlogPost


class EducationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Education

    institute_type = ma.auto_field(
        validate=[
            validate.OneOf(
                [
                    "University",
                    "College",
                    "High School",
                    "Community College",
                    "Graduate School",
                ],
                error='"{input}" is not a valid institution type.',
            )
        ]
    )

    institute_url = ma.auto_field(
        validate=[validate.URL(schemes={"https", "http"}, require_tld=True)]
    )


class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course

    course_url = ma.auto_field(
        validate=[validate.URL(schemes={"https", "http"}, require_tld=True)]
    )


class ExperiencePostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExperiencePost

    type = ma.auto_field(
        validate=[
            validate.OneOf(
                [
                    "Job",
                    "Internship",
                    "Volunteer",
                ],
                error='"{input}" is not a valid work experience type',
            )
        ]
    )


class CertandLicenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CertandLicense

    credential_url = ma.auto_field(
        validate=[validate.URL(schemes={"https", "http"}, require_tld=True)]
    )


class ProjectPostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ProjectPost
        include_fk = True

    project_repo_url = ma.auto_field(
        validate=[validate.URL(schemes={"https", "http"}, require_tld=True)]
    )

    project_url = ma.auto_field(
        validate=[validate.URL(schemes={"https", "http"}, require_tld=True)]
    )


class ShowcaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Showcase
        include_relationships = True

    project_posts = ma.Nested(ProjectPostSchema, many=True)
