#!/bin/bash
cp /var/www/influx-tutor/deploy/nginx.conf /etc/nginx/sites-available/influx-tutor
ln -sf /etc/nginx/sites-available/influx-tutor /etc/nginx/sites-enabled/influx-tutor
nginx -t && systemctl reload nginx && echo "nginx OK"
