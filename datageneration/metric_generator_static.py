import click
import json
import random
from datetime import datetime

from utils import load_path_mock


TRANSMISSION_RATE = 5  # seconds
FUEL_PROB = 0.5
FUEL_MAX = 0.3  # liters per TRANSMISSION_RATE seconds
PASSENGER_PROB = 0.5
PASSENGER_MAX = 5  # passengers per TRANSMISSION_RATE seconds
BUS_CAPACITY = 90  # passengers


class MockMetrics:

    def __init__(self, device_id, route_id, route_shift, init_timestamp, list_positions, list_speeds, init_fuel, init_passengers):
        self.device_id = device_id
        self.route_id = route_id
        self.route_shift = route_shift
        self.timestamp = init_timestamp
        self.positions = list_positions
        self.speeds = list_speeds
        self.fuel = init_fuel
        self.passengers = init_passengers

    def _has_next_metrics(self):
        return self.positions and self.speeds

    def _get_next_metrics(self):
        self.timestamp += TRANSMISSION_RATE

        # Fuel
        decrease_fuel = random.random() < FUEL_PROB
        if decrease_fuel:
            self.fuel = round(self.fuel - random.random() * FUEL_MAX, 3)

        # Passengers - TODO: receive this data from external camera counter
        # The number of passengers can change even if the bus is not at a stop (eg: stopped in traffic)
        change_passengers = self.speeds[0] < 1 and random.random(
        ) < PASSENGER_PROB
        if change_passengers:
            self.passengers += random.randint(
                max(-PASSENGER_MAX, -self.passengers),
                min(PASSENGER_MAX, BUS_CAPACITY - self.passengers)
            )

        return {
            'device_id': self.device_id,
            'route_id': self.route_id,
            'route_shift': self.route_shift,
            'timestamp': self.timestamp,
            'position': self.positions.pop(0),
            'speed': self.speeds.pop(0),
            'fuel': self.fuel,
            'passengers': self.passengers
        }

    def generate_metrics(self):
        metrics = []
        while self._has_next_metrics():
            metrics.append(self._get_next_metrics())
        return metrics


@click.command()
@click.option('--device_id', help='Id of the device on board of the bus.')
@click.option('--route_id', help='Id of the route to be simulated.')#
@click.option('--route_shift', help='Shift of the route to be simulated.')
@click.option('--input_mock', help='Path to mock.')
@click.option('--year', help='Year of the initial timestamp.')
@click.option('--month', help='Month of the initial timestamp.')
@click.option('--day', help='Day of the initial timestamp.')
@click.option('--hour', help='Hour of the initial timestamp.')
@click.option('--minute', help='Minute of the initial timestamp.')
@click.option('--second', help='Second of the initial timestamp.')
@click.option('--output_file', help='Path to output file.')

#
# Example: python3 metric_generator_static.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000 --input_mock monday/AVRBUS-R0001-1.json --year 2022 --month 12 --day 14 --hour 8 --minute 0 --second 0 --output_file monday/AVRBUS-R0001-1.json
#
def main(device_id, route_id, route_shift, input_mock, year, month, day, hour, minute, second, output_file):

    path = load_path_mock(input_mock)  # position and speed

    # Initialize the metrics generator
    metrics = MockMetrics(
        device_id=device_id,
        route_id=route_id,
        route_shift=route_shift,
        init_timestamp=int(datetime(int(year), int(month), int(day), int(hour), int(minute), int(second)).timestamp()),
        list_positions=[p['position'] for p in path],
        list_speeds=[p['speed'] for p in path],
        init_fuel=100,
        init_passengers=10)

    # Generate metrics
    output = "[\n"
    metrics = metrics.generate_metrics()
    for i, m in enumerate(metrics):
        #print(json.dumps(m))
        if i == len(metrics) - 1:
            output += json.dumps(m) + "\n]"
        else:
            output += json.dumps(m) + ",\n"

    fhandle = open("metrics/" + str(output_file), "w")
    fhandle.write(output)
    fhandle.close()

if __name__ == '__main__':
    main()
