#!/bin/bash

# set current working directory to directory of the shell script
cd "$(dirname "$0")"

curl https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js --output ../../vendor/jquery.min.js

curl https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.12/js/jquery.Jcrop.min.js --output ../../vendor/jquery.Jcrop.min.js
curl https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.12/css/jquery.Jcrop.min.css --output ../../vendor/jquery.Jcrop.min.css
curl https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.12/css/Jcrop.gif --output ../../vendor/Jcrop.gif
