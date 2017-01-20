var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
const config = require('./config');
const ds_helper = require('./helpers/ds_helper');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const DSRoutes = require('./routes/ds_routes');
app.use('/notifications', DSRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

ds_helper.subscribeToObservation(config.color_detector_client_name, 3335, 0, 'Colour', config.host + '/notifications/color_changed')
    .then((response) => {
        console.log("Succesfully subscribed to IPSO Colour object");
    })
    .catch((err) => {
        console.log(err);
    });