import atexit
import os
import sys
from pathlib import Path

from flask import Flask
from flask_mail import Mail
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool

import config as cg
from utils.newsletter import init_serializer_and_salt
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


# create app
def create_app(test=False):
    app = Flask(__name__, instance_relative_config=True)

    # decide and then set app config
    if test:
        app.config.from_object(cg.TestConfig())
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

    # init newsletter salt
    init_serializer_and_salt(app)

    # atexit registrations
    def run_db_drop_all():
        with app.app_context():
            db.drop_all()

    if test:
        atexit.register(run_db_drop_all)
    return app
