import base64
import random
import string
from functools import wraps

from flask import request, session


def login_user(username):
    """
    Generates a login token for the given username.
    Parameters:
    - username (str): The username for which to generate the token.
    Returns:
    - token (str): The generated login token.
    """
    choices = list(username + string.ascii_letters + string.digits)
    random.shuffle(choices)
    randomized_res = random.choices(choices, k=12)

    token = base64.urlsafe_b64encode("".join(randomized_res).encode()).decode()
    session["token"] = f"Bearer {token}"
    return token


def logout_user():
    """
    Logs out the user.
    """
    session.pop("token")


def login_required(func):
    """
    Decorator function that checks if the user is logged in by verifying the token in the request headers.
    Args:
        func: The function to be decorated.
    Returns:
        The decorated function.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        if not request.headers.get("Authorization") or not session.get("token"):
            return "", 403

        if request.headers["Authorization"] == session["token"]:
            return func(*args, **kwargs)
        else:
            return "", 403

    return wrapper
