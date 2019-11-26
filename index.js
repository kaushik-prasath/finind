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
let PORT = 3000;


// Display page to ask the user for their phone number
app.get('/', function(req, res) {
    res.render('home');
});

// Handle phone number submission
app.post('/verify', function(req, res) {
    var number = req.body.number;

    // Make request to Verify API
    messagebird.verify.create(number, {
        originator: 'Code',
        template: 'Your verification code is %token.'
    }, function(err, response) {
        if (err) {
            // Request has failed
            console.log(err);
            res.render('home', {
                error: err.errors[0].description
            });
        } else {
            // Request was successful
            console.log(response);
            res.render('verify', {
                id: response.id
            });
        }
    })
});


// Verify whether the token is correct
app.post('/success', function(req, res) {
    var id = req.body.id;
    var token = req.body.token;

    // Make request to Verify API
    messagebird.verify.verify(id, token, function(err, response) {
        if (err) {
            // Verification has failed
            console.log(err);
            res.render('verify', {
                error: err.errors[0].description,
                id: id
            });
        } else {
            // Verification was successful
            console.log(response);
            res.render('success');
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})