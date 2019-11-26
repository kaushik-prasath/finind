// Load Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

// Load configuration from .env file
require('dotenv').config();

// Load and initialize MesageBird SDK
var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);

// Set up and configure the Express framework
var app = express();
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: true
}));