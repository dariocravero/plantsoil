//backend requirements
var DocumentDBClient = require('documentdb').DocumentClient;
var PlantSoilOperator = require('./plantsoilOperator');

//boilerplate requirements
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//database configuration
var config = {};
config.host = process.env.HOST || "https://plantsoil.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "Gr8ptbHRaml0I+zk7RgDwoBRd/4TV7jq/Zr7AzCUYNdquljWzN2HPnPpl/yhlfAvCoXF4iKRP1umiCSCZ5SOHQ==";
config.databaseId = "plantsoil";
config.plantsCollectionId = "plants";
config.soilsCollectionId = "soils";

// - routes = require('./routes/index');
// - var users = require('./routes/users');

var app = express();

// view engine setup
// - app.set('views', path.join(__dirname, 'views'));
// - app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// - app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// PlantSoil App
var docDbClient = new DocumentDBClient(config.host, {
  masterKey: config.authKey
});
var plantsoilOperator = new PlantSoilOperator(docDbClient, config.databaseId, config.plantsCollectionId, config.soilsCollectionId);

/*
plantsoilOperator initializes by getting plants and soils collections
and storing them as self.plantsCollection, etc. and outputs them to the console successfully

I now am trying to test getPlants function by getting it to output the results
First attempt:
plantsoilOperator.init();
plantsoilOperator.getPlants();
returns that self.plantsCollection is null for some reason... I don't know why.
It gives this error:
  self.client.queryDocuments(self.plantsCollection._self, querySpec).toArray
                                                    ^TypeError: Cannot read property '_self' of null

My second attempt is below. The way it's set up, it should output '----' followed by whatever is returned...
but it doesn't output anything. WHy?

Third attempt: using .then();
plantsoilOperator.init().then(plantsoilOperator.getPlants());
resulted in same issue...
*/


plantsoilOperator.init(function(err) {
  if (err) {
    console.log(err);
  }
  plantsoilOperator.getPlants(function(err, results) {
    if (err) {
      console.log(err);
    }
    console.log('------------');
    console.log(results);
  });
});


// - app.use('/', routes);
// - app.use('/users', users);

//single page app functions
/*
app.get('/', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });
  });
});
*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
