#!/bin/bash

git pull origin master

cp ../connect/public/favicon.ico public/
cp ../connect/public/logo192.png public/
cp ../connect/public/logo512.png public/

npm i
npm run-script build

chown -R root:www-data .
systemctl reload apache2
