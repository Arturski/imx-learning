import requests
import time

base_url = "https://api.x.immutable.com/v1/assets?page_size=10&collection=0xb77b1d03da02598c117910f6f014ff05ccd6a09a"

def getData(url, cursor=None):
    if cursor:
        url = (f"{base_url}&cursor={cursor}")
    else:
        url = (base_url)
        
    payload={}
    headers = {
        'Accept': 'application/json'
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    items = response.json()
    return items


keepGoing = True

while keepGoing:
    data = getData(base_url)
    for i in data['result']:
        print(i['token_id'])
    if data['remaining'] == 0:
        keepGoing = False
        print('No More pages')
    else:
        print('next page.................')
        time.sleep(0.5)
        base_url = f"{base_url}&cursor={data['cursor']}"