#!/usr/bin/env bash

script=$1
logName=$2

echo script: $script logName: $logName

TZ=America/New_York
stamp() {
    date +"%Y-%m-%d %r"
}

# https://serverfault.com/a/310104
date-and-log() {
    while IFS= read -r line; do
        printf '%s %s\n' "$(stamp)" "$line" >> $logName
    done
}

echo  >> $logName
echo "RUNNING $script" | date-and-log

bash "$script" 2>&1 | date-and-log
