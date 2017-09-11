const express = require('express');
const bodyParser = require('body-parser');
const glob = require('glob');

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import models
require('./app/models')();

// import controllers
const controllers = glob.sync(`${__dirname}/app/controllers/**/*.js`);
controllers.forEach(controller => require(controller)(app));

// start the magic
const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Magic happens on port ${port} (${process.env.NODE_ENV})`);
