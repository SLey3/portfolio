from schedule import every, repeat

from utils.newsletter import update_serializer_and_salt


def register_jobs(app):
    # job registrations
    @repeat(every(2).days)
    def update_serializer_and_salt_job():
        update_serializer_and_salt(app)

    # immediately run any jobs that needs to be run with initialization of application
    update_serializer_and_salt_job()
