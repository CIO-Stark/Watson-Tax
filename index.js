require("dotenv").config({silent: true});

const express = require('express');
const path = require('path');
const app = express();
const cfenv = require('cfenv').getAppEnv();
const fs = require("fs");
const request = require("request");
const bodyParser = require("body-parser");

app.use(express.static(__dirname + '/client/dist'));

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
});

require('./server/app')(app, cfenv);

app.listen(cfenv.port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${cfenv.port}. Url: ${cfenv.url} `);
  }
});
