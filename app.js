var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
const config = require('./config');
const ds_helper = require('./helpers/ds_helper');
const db_helper = require('./helpers/db_helper');
const synchronization_helper = require('./helpers/synchronization_helper');

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');
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

// subscribe to color observation
ds_helper.subscribeToObservation(config.color_detector_client_name, 3335, 0, 'Colour', config.host + '/notifications/color_changed')
    .then((response) => {
        console.log("Succesfully subscribed to IPSO Colour object");
    })
    .catch((err) => {
        console.log(err);
    });

ds_helper.subscribeToObservation(config.conveyor_controller_client_name, 3200, 0, 'DigitalInputState', config.host + '/notifications/conveyor_state_changed')
    .then((response) => {
        console.log("Succesfully subscribed to IPSO digital Input object");
    })
    .catch((err) => {
        console.log(err);
    });

synchronization_helper.trySynchronizeConveyorState()
    .then(() => {
        setInterval(writeConveyorStateMeasurement, 1000);
    });

ds_helper.subscribeToClientConnectedEvent(config.host + "/notifications/client_connected")
    .then((response) => {
        console.log("Successfully subscribed to client connected event");
    })
    .catch((err) => {
        console.error(err);
    });




function writeConveyorStateMeasurement() {
    db_helper.getLastConveyorState()
        .then((response) => {
            db_helper.writeConveyorStateMeasurement(response);
        });
}