#!/bin/bash
# ./generate_metrics_r0002.sh
readonly device_id="AVRBUS-D0003"
readonly route_id="AVRBUS-R0002"
readonly route_shift="124500"

readonly year=2022
readonly month=12

readonly week_days=(monday tuesday wednesday thursday friday)

readonly days=(12 13 14 15 16)

readonly hours=(7 12 14 16 18)
readonly minutes=(40 45 30 55 30)
readonly seconds=(0 0 0 0 0)


for i in $(seq 0 4)
  do
    for f in $(seq 0 4)
      do
      let s=$f+1
      python3 metric_generator_static.py --device_id $device_id --route_id $route_id --route_shift $route_shift --input_mock ${week_days[$i]}/$route_id-$s.json  --year $year --month $month --day ${days[$i]} --hour ${hours[$f]} --minute ${minutes[$f]} --second ${seconds[$f]} --output_file ${week_days[$i]}/$route_id-$s.json
      done
  done

