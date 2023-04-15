## How to Run

### To Generate Individual Mock
<pre>
python3 mock_generator.py --route_id AVRBUS-R0001 --route_shift 064700 --name_of_file AVRBUS-R0001-00.json
</pre>

### Generate Multiple Mocks For Route AVRBUS-R0001 And Shift 064700
<pre>
./generate_mocks.sh AVRBUS-R0001 064700
</pre>


### To Generate Metrics From Individual Mock and Send It In Real-Time To RabbitMQ
<pre>
python3 metric_generator.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000
</pre>

### To Generate Static Metrics From Individual Mock
<pre>
python3 metric_generator_static.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000 --input_mock monday/AVRBUS-R0001-1.json --year 2022 --month 12 --day 14 --hour 8 --minute 0 --second 0 --output_file monday/AVRBUS-R0001-1.json
</pre>


### To Generate Multiple Static Metrics
<pre>
./generate_metrics_r0001.sh
</pre>

### To Read Events From RabbitMQ Events Queue
<pre>
python3 events_reader.py
</pre>

### To Insert Weekly Metrics to Cassandra through RabbitMQ and Spring Boot
<pre>
python3 metric_inserter --mode 'weekly'
</pre>

### To Insert MySQL Data
<pre>
python3 inserter.py --api_url http://localhost:8080/api
</pre>

### Example on how to run the camera sensor (the Run.py file is inside the Camera Sensor/People-Counting-in-Real-Time directory): 
<pre>
python3 metric_generator.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000 --sensor_camera True

python Run.py --prototxt mobilenet_ssd/MobileNetSSD_deploy.prototxt --model mobilenet_ssd/MobileNetSSD_deploy.caffemodel --input videos/example_01.mp4 --device_id AVRBUS-D0000
</pre>
