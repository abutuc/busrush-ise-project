#!/bin/bash
# ./generate_mocks.sh AVRBUS-R0001 064700
for i in $(seq 1 5)
do
  for day in "monday" "tuesday" "wednesday" "thursday" "friday"
    do
    python3 mock_generator.py --route_id $1 --route_shift $2 --name_of_file $day/$1-$i.json 
    done   
done
