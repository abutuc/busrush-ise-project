## How to Run

#### To create the jar run

mvn clean install -Dmaven.test.skip=true

#### Inside this directory, you need to run the following commands to download the data regarding portuguese maps

chmod +x init_osrm.sh && ./init_osrm.sh

And put all the files in a folder named data

#### Then to initialize the container

docker compose up --build
