import json
from bs4 import BeautifulSoup


def load_path_raw(filename):
    #
    # Loads a path from an GPX file.
    # Returns a list with the position and speed for each point.
    #

    with open('raw/' + filename, 'r') as f:
        data = f.read()

    bs_data = BeautifulSoup(data, 'xml')
    points = bs_data.find('trk').find('trkseg').find_all('trkpt')  # list

    path = []
    for p in points:
        path.append({
            'position': [float(p['lat']), float(p['lon'])],
            'speed': round(3.6*float(p.find('speed').text), 3)
        })
    return path


def load_path_mock(filename):
    #
    # Loads a path from a JSON file.
    # Returns a list with the position and speed for each point.
    #

    with open('mock/' + filename, 'r') as f:
        data = f.read()
    return json.loads(data)


def save_path_mock(path, filename):
    #
    # Saves a path to a JSON file.
    #

    with open('mock/' + filename, 'w') as f:
        f.write('[\n')
        f.write(',\n'.join([json.dumps(p) for p in path]))
        f.write('\n]')

def load_mysql_collection(filename):
    #
    # Loads a collection of data from a JSON file.
    # Returns a list with the objects.
    #

    with open('mysql/' + filename, 'r') as f:
        data = f.read()
    return json.loads(data)