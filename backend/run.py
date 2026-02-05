from app import create_app
import argparse

parser = argparse.ArgumentParser(prog="Portfolio Website Backend")


parser.add_argument("-t", "--test", action="store_true")

if __name__ == "__main__":
    args = parser.parse_args()

    if args.test:
        app = create_app(True)
    else:
        app = create_app()

    app.run(debug=True)
