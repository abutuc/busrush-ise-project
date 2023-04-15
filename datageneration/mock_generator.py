import random
from math import dist, sin
import geopy.distance
import numpy as np
import json
from datetime import datetime
import click

# to be called before writing on result on file

def format_result(result):
    result_string = "[\n"
    for i, item in enumerate(result):
        if i == len(result) - 1:
            result_string += json.dumps(item) + "\n]"
            return result_string
        result_string += json.dumps(item) + ",\n"


def generate_deviated_time(expected_time, max_deviation=0.2):
    deviation_sign_prob = random.random()
    if deviation_sign_prob > 0.8:
        deviation_sign = -1
    else:
        deviation_sign = 1
    time_deviation =  random.random() * max_deviation * expected_time * deviation_sign
    return time_deviation + expected_time


def generate_linear_but_not_evenly_spaced_coords(p1, p2, points):
    lat1, lon1 = p1
    lat2, lon2 = p2

    lats = np.random.uniform(0, 1, points)
    lons = np.random.uniform(0, 1, points)

    lats = lats * (lat2 - lat1)
    lons = lons * (lon2 - lon1)

    lats = lats + lat1
    lons = lons + lon1

    return [(round(lat, 5), round(lon, 5)) for lat, lon in zip(lats, lons)]


def route_geopy_distance(p1, p2):
    return geopy.distance.geodesic(p1, p2).m


def generate_result_struct(points, speeds):
    result = []
    for i in range(len(points)):
        result.append({"position": [points[i][0], points[i][1]], "speed": speeds[i]})
    return result


def generate_result_given_stops(stop1, stop2, expected_time_between_stops, step=5):
    # calc real-time
    real_time = generate_deviated_time(expected_time_between_stops)

    # compute linear route distance using geopy
    route_distance = route_geopy_distance(stop1, stop2)

    # compute array of time spaced evenly by step (rate from which the RabbitMQ will read the data)
    times = [i for i in range(5, int(real_time), step)]

    # theoretical constant speed value that takes the imaginary bus to travel route_distance in real-time
    constant_speed = ((route_distance/real_time) * 3600) / 1000

    # generation of speeds that follow a sine wave pattern with amplitude constant_speed ranged from [0, 2*constant_speed] for time in times
    speeds = [round(sin(t) * constant_speed + constant_speed, 3) for t in times if t != 0]

    # generation of linear but not evenly spaced coordinate ranging from ]stop1, stop2[ len(speed) coordinates
    points = generate_linear_but_not_evenly_spaced_coords(stop1, stop2, len(speeds))

    # stop1
    speeds.insert(0, 0)
    points.insert(0, stop1)

    # stop2
    speeds.append(0)
    points.append(stop2)

    return generate_result_struct(points, speeds)


def load_stops(fname):
    f = open(fname)
    stops = json.load(f)
    stops_dict = dict()
    for stop in stops:
        stops_dict[stop["id"]] = stop["position"]
    return stops_dict
    
def load_schedule(fname, stops, route_id=None, shift=None):
    f = open(fname)
    schedules = json.load(f)
    schedules_dict = dict()
    for schedule in schedules:
        if schedule["id"]["routeId"]["id"] == route_id and schedule["id"]["routeId"]["shift"] == shift:
            schedules_dict[schedule["id"]["sequence"]] = {"stopId": schedule["id"]["stopId"], "stopCoords": stops[schedule["id"]["stopId"]], "time": schedule["time"]}
    return schedules_dict


@click.command()
@click.option('--route_id', help='Id of the route to be simulated.')#
@click.option('--route_shift', help='Shift of the route to be simulated.')
@click.option('--name_of_file', help='Chosen name for output file.')
#
# Example: python3 mock_generator.py --route_id AVRBUS-R0001 --route_shift 064700 --name_of_file AVRBUS-R0001-00.json
#
def main(route_id, route_shift, name_of_file):
    result = []
    stops_coords = load_stops("mysql/stops.json")
    schedule = load_schedule("mysql/schedules.json", stops_coords, route_id, route_shift)
    sequence = list(schedule.keys())
    while len(sequence) != 1:
        stop1 = tuple(schedule[sequence[0]]["stopCoords"])
        stop2 = tuple(schedule[sequence[1]]["stopCoords"])
        
        time1 = schedule[sequence[0]]["time"]
        time2 = schedule[sequence[1]]["time"]

        time1 = datetime.strptime(time1, '%H:%M:%S')
        time2 = datetime.strptime(time2, '%H:%M:%S')

        time_difference = time2 - time1
        result += generate_result_given_stops(stop1, stop2, time_difference.seconds)

        sequence.pop(0)

    formated_result = format_result(result)
    fhandle = open("mock/" + str(name_of_file), "w")
    fhandle.write(formated_result)
    fhandle.close()

if __name__ == '__main__':
    main()
