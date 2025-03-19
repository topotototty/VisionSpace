import requests
import json

TOKEN = "7939458662:AAHQZit8mfjjcfmkMxNLrwZCaL577EtuJis"
url = f"https://api.telegram.org/bot7939458662:AAHQZit8mfjjcfmkMxNLrwZCaL577EtuJis/getUpdates"

response = requests.get(url)
data = response.json()

print(json.dumps(data, indent=4, ensure_ascii=False))
