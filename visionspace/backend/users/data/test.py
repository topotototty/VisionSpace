from requests import post


files = {
    'file': ('users.txt', open('./users.txt', 'rb'), 'text/plain')
}

r = post(
    url='http://localhost:8000/api/v1/users/import/file/',
    files=files)

print(r.status_code)
print(r.text)