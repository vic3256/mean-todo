var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config'); // index.js in config folder
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');


// set up port
var port = process.env.PORT || 3000;

// set up assets directory
app.use('/assets', express.static(__dirname + '/public'));

// set view engine
app.set('view engine', 'ejs');

// CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

// set views folder
// app.set('views', __dirname + '/views');

// connect to db
mongoose.connect(config.getDbConnectionString());

// add api endpoints
setupController(app);
apiController(app);




// listen to port
app.listen(port);