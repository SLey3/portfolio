import os
from threading import Lock

import pendulum
from itsdangerous import BadTimeSignature, URLSafeTimedSerializer

__all__ = [
    "update_serializer_and_salt",
    "generate_unsubscribe_token",
]

EXPIRATION_TIME = 2 * 86400  # fmt: skip # formula to convert days to seconds | in this case 2 days to seconds
serializer = None


class _Salt:
    def __init__(self):
        self.generated_day = None
        self.salt = None
        self.lock = Lock()

    def generate_salt(self):
        with self.lock:
            tz = pendulum.local_timezone()
            today = pendulum.now(tz)

            if not isinstance(self.generated_day, pendulum.DateTime):
                self.salt = os.urandom(16)
                self.generated_day = today
                return

            diff = self.generated_day.diff(today).in_days()

            if diff >= 2:
                self.salt = os.urandom(16)
                self.generated_day = today


_salter = _Salt()


def update_serializer_and_salt(app):
    global serializer

    _salter.generate_salt()

    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"], _salter.salt)


def generate_unsubscribe_token(user_email: str) -> str:
    """
    Generates an unsubscribe token for a given user email.
    Args:
        user_email (str): The email address of the user.
    Returns:
        str: A serialized token containing the user's email.
    """
    data = {"email": user_email}

    token = serializer.dumps(data)

    return token


def verify_token(token: str) -> dict[str, str] | bool:
    """
    Verifies the given token using a serializer.

    Args:
        token (str): The token to be verified.

    Returns:
        Any | bool: The data contained in the token if it is valid,
                    otherwise False if the token is invalid or expired.
    """
    try:
        data = serializer.loads(token, EXPIRATION_TIME)
    except BadTimeSignature:
        return False
    return data
