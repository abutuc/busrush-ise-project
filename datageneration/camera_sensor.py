import cv2
import imutils
import numpy as np
import argparse
import datetime
import csv
import socket
import selectors
import logging
import json
import os

HOGCV = cv2.HOGDescriptor()
HOGCV.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
ENCODING = 'utf-8'

class CameraSensor:
    def __init__(self):
        # Create a socket SIO server
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sel = selectors.DefaultSelector()
        self.people_in = 0
        self.people_out = 0
        self.passengers = 0

        # Bind the socket to a host and port
        try:
            self.server.bind(('localhost', 4000))
            print("BIND: Camera sensor server bind on (localhost, 4000)!")
        except Exception as e:
            print(f"DEBUG: Failed to bind server: {e}")
        
        # Listen for incoming connections
        try:
            self.server.listen()
            print("LISTEN: Ready to receive connections!")
        except Exception as e:
            print(f"DEBUG: Failed to start listening: {e}")

        self.sel.register(self.server, selectors.EVENT_READ, self.accept)

    # This function will be executed whenever a client connects to the server
    def accept(self, sock):
        client, address = sock.accept()
        #logging.debug(f"LOG: {conn} , {addr}")
        print(f"ACCEPTED: Connection accepted from {address}")
        self.sel.register(client, selectors.EVENT_READ, self.read)    

    # This function is called whenever there is incoming data on the connection
    def read(self, connection): 
        try:
            msg = connection.recv(1024)
            data = json.loads(msg)
            if data:
                print(f"RECEIVED: {data}")
                if data['command'] == 'activate_camera':
                    self.passengers = data['init_passengers']
                    self.detectByCamera(connection)
                elif data['command'] == 'detect_by_image':
                    self.detectByPathImage(data['path'])
                elif data['command'] == 'detect_by_video':
                    self.detectByPathVideo(data['path'])
                elif data['command'] == 'people_in_out':
                    msg = {'command': 'update_passengers', 'people_in': self.people_in, 'people_out': self.people_out, 'passengers': self.passengers}
                    self.send(connection, json.dumps(msg).encode())
            else:
                connection.close()
                self.sel.unregister(connection)
        except Exception as e:
            print(f"DEBUG: Failed to read data: {e}")
            connection.close()
            self.sel.unregister(connection)

    def send(self, connection, msg): 
        msg = json.dumps(msg)
        connection.send(str(msg).encode(ENCODING))

    def loop(self): 
        try: 
            while True: 
                events = self.sel.select()
                for key, mask in events: 
                    callback = key.data
                    callback(key.fileobj)
        except KeyboardInterrupt:
            self.server.close()

    def detectByCamera(self, writer): 
        # Create a VideoCapture object
        cap = cv2.VideoCapture(0)

        # Set the width and height of the frame
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        while True:
            print("Start")
            # Capture frame-by-frame
            ret, frame = cap.read()

            # Count the number of people
            result_image, person = self.detect(frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # When everything done, release the capture
        cap.release()
        cv2.destroyAllWindows()

    def detectByPathImage(self, path):
        image = cv2.imread(path)

        image = imutils.resize(image, width = min(800, image.shape[1])) 

        result_image, person = self.detect(image)

        # Show image with the people counter 
        #cv2.imshow('Detecting people...', result_image)
        # Press any key to close the image
        #cv2.waitKey(0)
        # Save the image
        #cv2.write('result_image.jpg', result_image)
        #cv2.destroyAllWindows()

        return person


    def detectByPathVideo(self, path, writer):

        video = cv2.VideoCapture(path)
        check, frame = video.read()
        if check == False:
            print('Video Not Found. Please Enter a Valid Path (Full path of Video Should be Provided).')
            return

        print('Detecting people...')
        while video.isOpened():
            #check is True if reading was successful 
            check, frame =  video.read()

            if check:
                frame = imutils.resize(frame , width=min(800,frame.shape[1]))
                frame, people = self.detect(frame)
            
                if writer is not None:
                    writer.write(frame)
                
                key = cv2.waitKey(1)
                if key== ord('q'):
                    break
            else:
                break
        video.release()
        cv2.destroyAllWindows()

        return people

    def detect(self, frame):
        bounding_box_cordinates, weights = HOGCV.detectMultiScale(frame, winStride = (4, 4), padding = (8, 8), scale = 1.03)
        
        person = 1
        for x,y,w,h in bounding_box_cordinates:
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)
            cv2.putText(frame, f'person {person}', (x,y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
            person += 1
        
        cv2.putText(frame, 'Status : Detecting ', (40,40), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255,0,0), 2)
        cv2.putText(frame, f'Total Persons : {person-1}', (40,70), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255,0,0), 2)
        cv2.imshow('output', frame)
        datetimee = datetime.datetime.now().__format__('%Y-%m-%d %H:%M:%S')
        print(f"LOG: {person} people detected at {datetimee}")
        return frame, person


if __name__ == '__main__':
    camera = CameraSensor()
    camera.loop()   



