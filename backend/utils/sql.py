"""
This module contains utility functions related to SQL operations needed in setup of application.
"""

from math import ceil
from typing import Any, List

from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session

__all__ = [
    "SQLAlchemyBase",
    "showcase_has_data",
    "get_total_project_pages",
    "paginate_project_posts",
    "get_total_blog_posts",
    "show_blog_posts",
]


class SQLAlchemyBase(DeclarativeBase):
    """
    Base class for SQLAlchemy models.

    This class serves as the base for all SQLAlchemy models in the application.
    It inherits from the `DeclarativeBase` class provided by SQLAlchemy.
    """

    pass


def showcase_has_data(engine: Engine) -> bool:
    """
    Check if the 'showcase' table has data.

    Args:
        engine (Engine): The SQLAlchemy engine object used to connect to the database.

    Returns:
        bool: True if the 'showcase' table has data, False otherwise.
    """
    with Session(engine) as session:
        count = session.execute(text("SELECT COUNT(*) FROM showcase")).scalar()

        if count == 0:
            return False
    return True


def get_total_project_pages(engine: Engine) -> int:
    """
    Calculate the total number of pages based on the count of all results in the project_post modal.

    Args:
        engine: The SQLAlchemy engine used to connect to the database.

    Returns:
        The total number of pages in the project_post modal.

    """
    with Session(engine) as session:
        total_count = session.execute(
            text("SELECT COUNT(*) FROM project_post")
        ).scalar()

    calc = ceil(total_count / 4)  # ceil(count of all results in modal / page size))

    return calc


def paginate_project_posts(model, engine: Engine, page: int) -> List[Any]:
    """
    Paginates project posts based on the given model, engine, and page number.

    Args:
        model: The model to query for project posts.
        engine: The database engine to use for the query.
        page: The page number to retrieve.

    Returns:
        A list of project posts for the specified page.
    """
    page_offset = (
        page - 1
    ) * 4  # 4: The number of project posts per page (e.g. page_size)

    with Session(engine) as session:
        query = session.query(model).offset(page_offset).limit(4)
        res = query.all()

    return res


def get_total_blog_posts(engine: Engine) -> int:
    """
    Retrieves the total number of blog posts from the database.
    Parameters:
    - engine (Engine): The SQLAlchemy engine used to connect to the database.
    Returns:
    - int: The total number of blog posts.
    """
    with Session(engine) as session:
        total_blogs = session.execute(text("SELECT count(*) FROM blog_post")).scalar()

    return total_blogs


def show_blog_posts(model, engine: Engine, total_pages: int) -> List[Any]:
    """
    Query's a limit to amount of blog posts shown.

    Args:
        model: The model to query for project posts.
        engine: The database engine to use for the query.
        total_pages: Total pages to show

    Returns:
        A list of blog posts for the specified limit
    """
    with Session(engine) as session:
        query = session.query(model).filter_by(is_draft=0).limit(total_pages)
        res = query.all()

    return res
