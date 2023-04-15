#!/bin/sh

while :; do
    echo "Flushing redis..."
    redis-cli -h cache -p 6379 -a eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81 flushall
    sleep 30
done
