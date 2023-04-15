import click
import numpy as np
import os
import requests

from http.client import responses
from utils import load_mysql_collection


@click.command()
@click.option('--api_url', help='URL of the API.')
#
# Example: python3 inserter.py --api_url http://localhost:8080/api
#
def main(api_url):

    # Check if the folder exists
    if not os.path.exists('mysql'):
        print('Unable to find folder "mysql" in current directory.')
        return

    # Check if the folder contains all required files
    req_files = ['devices.json', 'buses.json', 'drivers.json', 'routes.json', 'stops.json', 'schedules.json']
    cur_files = os.listdir('mysql')

    if not np.isin(req_files, cur_files).all():
        print(f'The folder is missing the following files: {[file for file in req_files if file not in cur_files]}')
        return

    # Check if the API is running
    try:
        requests.get(api_url)
    except:
        print('The API is not running.')
        return

    # Read each file in the specified order
    for file in req_files:
        endpoint = file[:-5] # removes the ".json" extension
        data = load_mysql_collection(file)

        # POST to the API
        for obj in data:
            res = requests.post(api_url + '/' + endpoint, json=obj)
            print(f'{endpoint:10} | {res.status_code} {responses[res.status_code]:15} | {obj}')

        # Check if the API has the correct number of objects
        req_len = len(data)
        cur_len = len(requests.get(api_url + '/' + endpoint).json())

        if cur_len == req_len:
            print(f'{"":10} | All {endpoint} were succesfully posted to the API!')
        else:
            print(f'{"":10} | The API has {cur_len} {endpoint}, expected {req_len}.')
            return

if __name__ == '__main__':
    main()
