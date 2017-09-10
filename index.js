var express = require('express')
var bodyParser = require('body-parser')
var glob = require('glob')

var app = express()

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// import models
require('./app/models')()

// import controllers
var controllers = glob.sync(__dirname + '/app/controllers/**/*.js')
controllers.forEach(function (controller) {
  return require(controller)(app)
})

// start the magic
var port = process.env.PORT || 3000
app.listen(port)

console.log('Magic happens on port ' + port + ' (' + process.env.NODE_ENV + ')')
