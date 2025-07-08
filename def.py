from curl_cffi import requests

sessionse = requests.Session(impersonate="chrome")

print(requests.get("https://zefoy.com/").text)