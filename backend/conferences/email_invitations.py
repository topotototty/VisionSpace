# import io
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from conferences.models import Conference
# from .utils import generate_ics_file


def send_mail_to_invited(conference: Conference, participants: list, domain: str):
    email = EmailMultiAlternatives(
        'Новое событие',
        to=participants
    )
    # ics_file = generate_ics_file(
    #     conference.title,
    #     conference.started_at,
    #     conference.ended_at,
    #     conference.description,
    #     f'https://{domain}/meeting/{conference.id}'
    # )
    # f = io.BytesIO(ics_file.encode('utf-8'))
    # email.attach(filename='Тест.ics', content=f.getvalue(), mimetype='text/calendar')
    email_template = render_to_string('email.html', context={'conference_id': conference.id})
    email.attach_alternative(email_template, 'text/html')
    email.send()
    # f.close()
