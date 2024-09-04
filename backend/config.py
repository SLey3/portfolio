"""
Backend Configuration for the app instanse of the portfolio website
Includes:
Development Config
Testing Config
Production Config
"""

import os

from dotenv import load_dotenv

__all__ = ["DevConfig", "TestConfig", "ProdConfig"]

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DEBUG = True
    SQLALCHEMY_ECHO = True
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_DEBUG = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PWD")


class DevConfig(BaseConfig):
    DEVELOPMENT = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        basedir, "instance", "database.sql"
    )


class TestConfig(BaseConfig):
    TESTING = True

    SQLALCHEMY_ECHO = False


class ProdConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_PROD_DATABASE_URI")
    MAIL_DEBUG = False
