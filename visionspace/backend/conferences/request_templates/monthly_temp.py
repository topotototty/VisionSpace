"""
Первый пример для "Ежемесячные конференций"

title: string
description: string
type: string (repetitive)
time: object
    start: string (HH:MM)
    end: string (HH:MM)
participants: array of strings (emails)
properties: object
    interval: string (daily, weekly, monthly, yearly)
    interval_settings: array of (number, boolean) or (n-th day or 0, workdays only (boolean))
    repeat: object
        start_date: string (YYYY.MM.DD)
        end_date: string (YYYY.MM.DD) or null
        repetitions: number or null
"""

{
    "title": "Конференция",
    "description": "Конференция",
    "type": "repetitive",
    "time": {
        "start": "10:00:00",  # Время начала
        "end": "11:00:00"  # Время окончания
    },
    "participants": [
        "admin1@a.ru",
        "admin2@a.ru",
        "user3@b.ru"
    ],
    "properties": {
        "interval": "montly",  # Вариант интервала (Ежедневно, Еженедельно, Ежемесячно, Ежегодно)
        "periodicity": [
            [
                12,  # Число для повтора
                1   # Число месяца
            ],
        ],
        "limits": {
            "start_date": "2025.01.12",  # Дата начала
            "end_date": "2026.01.12"  # Завершить на дате.
        }
    }
}