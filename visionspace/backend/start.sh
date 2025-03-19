#!/bin/sh
python manage.py makemigrations && \
python manage.py migrate && \
python manage.py collectstatic --no-input

gunicorn app.wsgi:application --bind 0.0.0.0:8000