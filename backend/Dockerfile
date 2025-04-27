FROM python:3.11

# Рабочая папка внутри контейнера
WORKDIR /app

# Устанавливаем ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Копируем проект
COPY . .

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Открываем порт для сервера
EXPOSE 8000

# Запуск Django через gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "vision.wsgi:application"]
