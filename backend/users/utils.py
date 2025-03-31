from django.db import models
from xml.etree import ElementTree as ET
import json


class UserRole(models.TextChoices):  # Тут числовые значения?
    """Типы конференции."""
    MEMBER = 'MEMBER', ('Member')
    MODERATOR = 'MODERATOR', ('Moderator')
    TECH_SUPPORT = 'TECH_SUPPORT', ('Tech_support')


def json_reader(file_content: bytes):
    return json.loads(file_content)


def xml_reader(file_content: bytes):
    root = ET.fromstring(file_content)

    users = []

    for user_element in root.findall('user'):
        user = {
            'lastname': user_element.find('lastname').text,
            'firstname': user_element.find('firstname').text,
            'email': user_element.find('email').text,
            'password': user_element.find('password').text
        }
        users.append(user)

    return users


def txt_reader(file_content: bytes, separator='-'):
    lines = file_content.decode('utf-8').splitlines()
    parsed_data = []

    for line in lines:
        parts = line.split(separator)

        if len(parts) >= 4:
            user = {
                'lastname': parts[0],
                'firstname': parts[1],
                'email': parts[2],
                'password': parts[3]
            }
            parsed_data.append(user)

    return parsed_data


def xml_to_dict(element):
    """
    Рекурсивно преобразует XML элемент в словарь Python.
    """
    data = {}

    # Если у элемента есть атрибуты, добавляем их в словарь
    if element.attrib:
        data.update(("@" + k, v) for k, v in element.attrib.items())

    # Если у элемента есть текст, добавляем его как '_text'
    if element.text and element.text.strip():
        data['_text'] = element.text.strip()

    # Рекурсивно обрабатываем дочерние элементы
    children = list(element)
    if children:
        child_dict = {}
        for child in children:
            child_dict.setdefault(child.tag, []).append(xml_to_dict(child))
        data.update(child_dict)

    return data
