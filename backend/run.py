import os

from app import create_app

if __name__ == "__main__":
    app = create_app()

    if os.getenv("PRODUCTION") == "True":
        app.run()
    else:
        app.run(debug=True)
