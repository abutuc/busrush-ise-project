import click
import json
import os
import pika
import random
from datetime import datetime
from time import sleep
import socket
import json
import subprocess
from utils import load_path_mock
import sys

TRANSMISSION_RATE = 5  # seconds
FUEL_PROB = 0.5
FUEL_MAX = 0.3  # liters per TRANSMISSION_RATE seconds
PASSENGER_PROB = 0.5
PASSENGER_MAX = 5  # passengers per TRANSMISSION_RATE seconds
BUS_CAPACITY = 90  # passengers
CAMERA_ACTIVE = False
client = None
ENCODING = 'utf-8'

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
            if (CAMERA_ACTIVE):
                # This two lines of code are for sending requests via socket
                #send(client, {'command': 'people_in_out', 'passengers': self.passengers, 'timestamp': self.timestamp})
                #self.passengers += receive_data(client)
                # The camera logs will be in the following file
                output_filename = 'data/camera_{}.txt'.format(self.device_id)
                if os.stat(output_filename).st_size != 0: 
                    # To get the current number of passengers, we read the last entry in the camera logs file
                    last_line = subprocess.run(["tail", "-1", output_filename], capture_output=True).stdout
                    if last_line != "Camera Stopped":
                        # Parse the last line as a JSON object
                        last_line_obj = json.loads(last_line)
                        # Access the attributes of the JSON object
                        # bus_id = last_line_obj["bus_id"]
                        # enter = last_line_obj["enter"]
                        # exit = last_line_obj["exit"]
                        # occupancy = last_line_obj["occupancy"]
                        # bus_capacity = last_line_obj["busCapacity"]
                        # time = last_line_obj["time"]
                        occupation = last_line_obj["occupation"]
                        self.passengers = occupation
                    else: 
                        print("[INFO] Camera not operational anymore")
                        sys.exit()
                else: 
                    print("[INFO] Camera did not start in time")
                    self.passengers += random.randint(
                        max(-PASSENGER_MAX, -self.passengers),
                        min(PASSENGER_MAX, BUS_CAPACITY - self.passengers))
            else:         
                self.passengers += random.randint(
                    max(-PASSENGER_MAX, -self.passengers),
                    min(PASSENGER_MAX, BUS_CAPACITY - self.passengers))

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
        while self._has_next_metrics():
            yield self._get_next_metrics()
            sleep(TRANSMISSION_RATE)


# Connect to the camera sensor script
def connect_camera_sensor(ctx, init_passengers): 
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try: 
        client.connect(('localhost', 4000))
        print(f"LOG: Connected to camera sensor script on port 4000")
    except socket.error as e:
        print(f"DEBUG; Could not connect to the camera sensor{str(e)}")
    
    # Sendind a message to the camera sensor script to activate the camera
    camera = ctx.params['sensor_camera']
    path = ctx.params['sensor_footage']

    if camera == 'True':
        send(client,{'command': 'activate_camera', 'init_passengers': init_passengers})
    elif ctx.params['sensor_footage'] is not None and camera == 'False':
        base, ext = os.path.splitext(ctx.params['sensor_footage'])
        if ext.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
            send(client, {'command': 'detect_by_image', 'format': 'image', 'path': path})
        elif ext.lower() in ['.mp4', '.avi', '.mov', '.mkv']:
            send(client,{'command': 'detect_by_video', 'format': 'video', 'path': path})

# Send a request to the camera sensor script
def send(sock, msg):
    # Write the message
    data = json.dumps(msg)
    msg = str(data).encode(ENCODING)
    
    # Use the SocketIO client to emit a request event with the given data
    try:
        sock.send(msg)
        print(f"LOG: Sent message to the camera sensor script: {data}")
    except socket.error as e:
        print(f"DEBUG: Could not send message to the camera sensor: {str(e)}")
    
# Receive a response from the camera sensor script
def receive_data(sock):
    # Receive the response data using the socket
    response = sock.recv(1024)
    response = json.loads(response)
    print(f"RECEIVED: Received response from camera sensor script: {response}")
    people_in = response["people_in"]
    print(f"CAMERA SENSOR: {people_in} entered the bus")
    people_out = response["people_out"]
    print(f"CAMERA SENSOR: {people_in} exited the bus")
    people_balance = people_in - people_out
    print(f"PASSENGERS BALANCE: {people_balance} people")
    return people_balance


@click.command()
@click.option('--device_id', help='Id of the device on board of the bus.')
@click.option('--route_id', help='Id of the route to be simulated.')#
@click.option('--route_shift', help='Shift of the route to be simulated.')
@click.option('--sensor_camera', required=False, default='False', help='Camera to be used to count passengers.')

#
# Example: python3 metric_generator.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000
#

def main(device_id, route_id, route_shift, sensor_camera):

    # Connect to RabbitMQ
    conn = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = conn.channel()
    channel.queue_declare(queue='devices', durable=True)

    # Choose a random mock from the provided route
    route_mocks = [filename for filename in os.listdir('mock')
                   if filename.startswith(route_id)]
    chosen_mock = route_mocks[random.randint(0, len(route_mocks) - 1)]

    path = load_path_mock(chosen_mock)  # position and speed

    # Get values of click parameters
    if sensor_camera == 'True':
        #client = connect_camera_sensor(ctx, 10)
        CAMERA_ACTIVE = True

    # Initialize the metrics generator
    metrics = MockMetrics(
        device_id=device_id,
        route_id=route_id,
        route_shift=route_shift,
        init_timestamp=int(datetime.now().timestamp()),
        list_positions=[p['position'] for p in path],
        list_speeds=[p['speed'] for p in path],
        init_fuel=100,
        init_passengers=10)

    # Generate metrics
    for m in metrics.generate_metrics():
        # print('...', flush=True) - To print in Docker Terminal
        channel.basic_publish(exchange='',
                              routing_key='devices',
                              body=json.dumps(m))
        print(json.dumps(m))
    conn.close()


if __name__ == '__main__':
    main()
