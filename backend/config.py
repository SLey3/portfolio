"""
Backend Configuration for the app instance of the portfolio website backend
Includes:
Development Config
Testing Config
Production Config
"""

import os
from dotenv import load_dotenv

__all__ = ["DevConfig", "TestConfig", "ProdConfig"]

load_dotenv()


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DEBUG = True
    TESTING = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PWD")
    NL_SALT = os.getenv("NL_SALT")


class DevConfig(BaseConfig):
    DEVELOPMENT = True
    MAIL_DEBUG = True

    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_TESTING_DEV_DATABASE_URI")


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = False

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_TESTING_DEV_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProdConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_PROD_DATABASE_URI")
