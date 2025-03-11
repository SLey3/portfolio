# imports
import pytest
import sqlalchemy as sa
from dotenv import load_dotenv
from app import create_app, mail


# mini configuration
load_dotenv(".")

engine: sa.Engine = None


# test fixtures
@pytest.fixture(scope="session")
def app():
    """
    Fixture for creating and configuring the test application.
    This fixture is scoped to the entire test session, meaning it will be set up once
    and shared across all tests in the session. It creates an instance of the application
    configured for testing and yields it for use in tests.
    Yields:
        Flask: The test application instance.
    """
    # test app creation
    app = create_app(True)

    # yield app
    yield app


@pytest.fixture
def app_ctx(app):
    """
    Fixture to provide an application context for testing.

    This fixture creates an application context using the provided `app` fixture.
    It yields control back to the test, allowing the test to run within the
    application context. Once the test is complete, the application context is
    automatically torn down.

    Args:
        app: The Flask application instance provided by the `app` fixture.

    Yields:
        None: This fixture does not return any value.
    """
    with app.app_context():
        yield


@pytest.fixture
def create_engine(app, datadir):
    """
    Fixture to create and configure a SQLAlchemy engine for testing.
    This fixture sets up a SQLAlchemy engine using the application's database URI
    and populates the database with mock data from a specified SQL file. The mock
    data file is expected to have comments and spaces in the first three lines,
    which are skipped.
    Args:
        app (Flask): The Flask application instance.
        datadir (dict): A dictionary containing paths to data files, including the
                        "mockdbdata.sql" file with mock data.
    Returns:
        sqlalchemy.engine.Engine: The configured SQLAlchemy engine.
    """
    global engine
    engine = sa.create_engine(app.config["SQLALCHEMY_DATABASE_URI"], echo=True)

    with engine.connect() as conn:
        mock_data_stmts = (
            datadir["mockdbdata.sql"].open("r").readlines()[3:]
        )  # skips comments and space in the beginning of the file

        for stmt in mock_data_stmts:
            conn.execute(sa.text(stmt.replace("\n", "")))
            conn.commit()
    return engine


@pytest.fixture
def sa_engine():
    """
    A pytest fixture that provides a SQLAlchemy engine for testing.

    This fixture checks if the `engine` is available. If the `engine` is `None`,
    the test will be skipped with a message indicating that the test function
    requires an engine that does not exist.

    Returns:
        engine: The SQLAlchemy engine if it exists.

    Raises:
        pytest.skip: If the `engine` is `None`.
    """
    if engine is None:
        pytest.skip("test function requires an engine that does not exist")

    return engine


@pytest.fixture
def client(app):
    """
    Fixture to provide a test client for the Flask application.

    Args:
        app (Flask): The Flask application instance.

    Returns:
        FlaskClient: A test client for the Flask application.
    """
    return app.test_client()


@pytest.fixture
def user(client):
    """
    Fixture to authenticate a user and retrieve a bearer token.
    This fixture sends a POST request to the "/admin/login" endpoint with a predefined
    email and password. It returns the bearer token from the response.
    Args:
        client: The test client used to send the request.
    Returns:
        str: The bearer token from the login response.
    """
    payload = {"email": "admin@admin.com", "password": "RAYiSGAqjAke"}

    res = client.post("/admin/login", json=payload)

    return res.json["bearer"]


@pytest.fixture
def mail_outbox():
    """
    Fixture to capture outgoing email messages.

    This fixture uses the `mail.record_messages()` context manager to capture
    all outgoing email messages during a test. The captured messages are
    yielded as a list, allowing tests to inspect the contents of the outbox.

    Yields:
        list: A list of captured email messages.
    """
    with mail.record_messages() as outbox:
        yield outbox
