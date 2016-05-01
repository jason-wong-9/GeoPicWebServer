var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(config.database, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var api = require('./server/routes/api')(app, express);
app.use('/api', api);

var port = 8080;

if (!config.dev){
	port = process.env.PORT;
}


app.listen(port, function(err){
  if (err) {
    console.log(error);
  } else {
    console.log("Server Running on " + port); 
  }
   
});