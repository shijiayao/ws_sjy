#!/bin/bash

cd /root/node_server && npm run stop && ps -aux | grep nginx;
