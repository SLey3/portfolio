import atexit
import os
import sys
from pathlib import Path
from threading import Thread
from time import sleep

from flask import Flask
from flask_mail import Mail
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from schedule import clear as sched_clear
from schedule import run_pending
from sqlalchemy.pool import NullPool

import config as cg
from scheduler import register_jobs
from utils.sql import showcase_has_data, SQLAlchemyBase

sys.path.append(str(Path(__file__).resolve().parent.parent))

# Flask Library's
db = SQLAlchemy(
    model_class=SQLAlchemyBase,
    disable_autonaming=True,
    engine_options={"poolclass": NullPool},
)

ma = Marshmallow()
migrate = Migrate()
mail = Mail()


# internal functions
def _run_scheduler():
    while True:
        run_pending()
        sleep(1)


def _start_scheduler():
    thread = Thread(target=_run_scheduler)
    thread.daemon = True
    thread.start()


# create app
def create_app(test=False, tmp_db_dir=None):
    app = Flask(__name__, instance_relative_config=True)

    # decide and then set app config
    if test:
        app.config.from_object(cg.TestConfig())
        db_dir = f"sqlite:///{tmp_db_dir}/temp_db.sql"
        app.config["SQLALCHEMY_DATABASE_URI"] = db_dir
    else:
        if os.getenv("PRODUCTION"):
            app.config.from_object(cg.ProdConfig())
        else:
            app.config.from_object(cg.DevConfig())

    # init db
    db.init_app(app)

    import models  # noqa: F401

    with app.app_context():
        db.create_all()

        if not showcase_has_data(db.engine):
            showcase = models.Showcase()
            db.session.add(showcase)
            db.session.commit()

    # init flask library's
    ma.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # blueprint registrations
    from api import api

    app.register_blueprint(api)

    # register scheduler jobs
    with app.app_context():
        register_jobs(app)

    # start job scheduler
    _start_scheduler()

    # atexit registrations
    if test:
        atexit.register(db.drop_all)
    atexit.register(sched_clear)
    return app
