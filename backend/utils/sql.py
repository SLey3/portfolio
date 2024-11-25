"""
This module contains utility functions related to SQL operations needed in setup of application.
"""

from math import ceil
from typing import Any, List

import requests
from sqlalchemy import func, inspect, select, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import OperationalError
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


def _sql_row_to_dict(
    engine: Engine, obj: tuple[Any, Any], tablename: str, not_star: None | List[str]
):
    if not_star:
        return {key: val for key, val in zip(not_star, obj)}

    columns = inspect(engine).get_columns(tablename)

    return {key["name"]: val for key, val in zip(columns, obj)}


def _get_table_with_url_columns(engine: Engine):
    """internal function table columns for all tables with a column or more containing urls"""
    inspector = inspect(engine)
    for tablename in ["cert_and_license", "course", "education", "project_post"]:
        yield (
            inspector.get_columns(tablename),
            tablename,
        )


def inspect_links(engine: Engine) -> List[dict[str, Any]]:
    """
    Inspects links in the database tables and returns their validity and status.
    Args:
        engine (Engine): SQLAlchemy Engine instance to connect to the database.
    Returns:
        List[dict[str, Any]]: A list of dictionaries containing the following keys:
            - item_id (str): The ID of the item.
            - link (str): The URL link.
            - validity (bool): True if the link is valid (HTTP status code starts with '2'), False otherwise.
            - http_code (int): The HTTP status code returned by the HEAD request.
            - highlight (str): The highlight color based on the HTTP status code.
    """
    results = []

    for table, table_name in _get_table_with_url_columns(engine):
        for column in table:
            if column["name"].find("url") == -1:
                continue

            with Session(engine) as session:
                column_res = session.execute(
                    text(
                        f"SELECT id, {column['name']} FROM {table_name} WHERE {column['name']} IS NOT NULL"
                    )
                ).fetchall()

                for row in column_res:
                    url = row[1]
                    res = requests.head(url)

                    if not res.ok:
                        if (
                            "Server" in res.headers
                            and "AkamaiGHost" in res.headers["Server"]
                        ):
                            validity = (
                                "Validity check failed due to AkamaiGHost interfering"
                            )
                        elif "CF-RAY" in res.headers or (
                            "Server" in res.headers
                            and "cloudflare" in res.headers["Server"]
                        ):
                            validity = (
                                "Validity check failed due to CloudFlare Interfering"
                            )
                        else:
                            validity = False
                    else:
                        validity = str(res.status_code).startswith("2")

                    results.append(
                        {
                            "tablename": table_name,
                            "item_id": row[0],
                            "link": url,
                            "validity": validity,
                            "http_code": res.status_code,
                        }
                    )

    return results


def execute_select(query: str, engine: Engine) -> tuple[Any, int]:
    """
    Executes a SELECT SQL query and returns the scalar result.

    Args:
        query (str): The SQL query to be executed.
        engine (Engine): The SQLAlchemy engine to use for the database connection.

    Returns:
        Any: The scalar result of the executed query.
    """
    not_star = None

    with Session(engine) as session:
        try:
            res = session.execute(text(f"SELECT {query}")).fetchall()
            rows = [tuple(row) for row in res]
            table = query.split("FROM")[1].split("WHERE")[0].strip()
        except OperationalError as sqlerr:
            err_msg = sqlerr._message()
            return (
                err_msg,
                400,
            )

    if rows != []:
        columns = query.split("FROM")[0].strip()

        if columns != "*":
            not_star = columns.split(",")

        for i, row in enumerate(rows):
            rows[i] = _sql_row_to_dict(engine, row, table, not_star)
        return (
            rows,
            200,
        )
    return (
        "Table exists but is empty",
        206,
    )


def showcase_has_data(engine: Engine) -> bool:
    """
    Check if the 'showcase' table has data.

    Args:
        engine (Engine): The SQLAlchemy engine object used to connect to the database.

    Returns:
        bool: True if the 'showcase' table has data, False otherwise.
    """
    with Session(engine) as session:
        count = session.execute(
            select(func.count("*").label("showcase_total_count")).select_from(
                text("showcase")
            )
        ).scalar()

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
            select(func.count("*").label("project_total_count")).select_from(
                text("project_post")
            )
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
        total_blogs = session.execute(
            select(func.count("*").label("blog_total_count")).select_from(
                text("blog_post")
            )
        ).scalar()
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
        query = session.query(model).filter_by(is_draft=False).limit(total_pages)
        res = query.all()

    return res
