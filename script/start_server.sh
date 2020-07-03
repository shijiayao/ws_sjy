#!/bin/bash

nginx -c /root/nginx/conf/nginx.conf;

cd /root/node_server && npm run start;

