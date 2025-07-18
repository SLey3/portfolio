# imports
from werkzeug.test import TestResponse
from enum import IntEnum


# Used HTTP code Enum
class HTTPCode(IntEnum):
    """
    Integer enumeration class representing HTTP status codes used by the API.

    Attributes:
        PASS (int): HTTP status code 200 (OK) - The request has succeeded.
        NO_CONTENT (int): HTTP status code 204 (No Content) - The server successfully processed the request,
        but is not returning any content.
        BAD_REQ (int): HTTP status code 400 (Bad Request) - The server cannot or will not process
        the request due to an apparent client error.
        FORBIDDEN (int): HTTP status code 403 (Forbidden) - The server understood the request but refuses
        to authorize it.
        NOT_FOUND (int): HTTP status code 404 (Not Found) - The server did not find the requested content
        INTERNAL_SERVER_ERR (int): HTTP status code 500 (Internal Server Error) - A generic error message returned
        when an unexpected condition was encountered on the server.
    """

    PASS = 200
    NO_CONTENT = 204
    BAD_REQ = 400
    FORBIDDEN = 403
    NOT_FOUND = 404
    INTERNAL_SERVER_ERR = 500


# helper functions for test
def assert_status_code(res: TestResponse, sc: int, msg: str = None):
    """
    Asserts that a test response has the expected status code.
    Args:
        res (TestResponse): The response object to check.
        sc (int): The expected status code.
        msg (str, optional): Custom error message format.
            Can include {sc} and {asc} placeholders for the expected and actual status codes.
            Defaults to a standard error message if not provided.
    Raises:
        AssertionError: If the response's status code does not match the expected code.
    Example:
        >>> assert_status_code(response, 200)
        >>> assert_status_code(response, 404, "Expected {sc} but got {asc}")
    """
    if msg:
        f_msg = msg.format(sc=sc, asc=res.status_code)
    else:
        f_msg = f"Status code is not {sc} as expected but rather: {res.status_code}"

    assert res.status_code == sc, f_msg


def assert_not_status_code(msg: str, **kwargs):
    """
    Verifies that a response does not have the stated status code.

    This function is the negation of assert_status_code.
    If assert_status_code raises an AssertionError, the assertion passes.
    If assert_status_code does not raise an AssertionError,
    this function raises an AssertionError with the provided message.

    Args:
        msg (str): The error message to display if the assertion fails
        **kwargs: The keyword arguments to pass to assert_status_code

    Raises:
        AssertionError: If the response has the status code that was being tested for

    Returns:
        None
    """
    try:
        assert_status_code(**kwargs)
    except AssertionError:
        return
    else:
        raise AssertionError(msg)
