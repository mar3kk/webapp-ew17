const ds_helper = require("../helpers/ds_helper");
const db_helper = require("../helpers/db_helper");
const config = require('../config');
const bluebird = require('bluebird');
const synchronization_helper = require('../helpers/synchronization_helper');

exports.onColorChanged = function (req, res) {
    console.log("Number of items in callback : %d", req.body.Items.length);
    let colour = req.body.Items[0].Value.Colour;
    colour = colour.trim();
    if (colour === "none") {
        console.info("color " + colour);
        db_helper.setLastColor(colour);
        return;
    }

    let allowedColor = false;

    config.allowed_colors.forEach(function (element) {
        if (colour === element) {
            allowedColor = true;
            return false;
        }
    });

    if (allowedColor === false) {
        console.error("Invalid color : %s", colour);
        return;
    }

    db_helper.getLastColor()
        .then((lastColor) => {
            if (lastColor === colour) {
                return bluebird.reject("Got duplicated notification from device server");
            } else {
                return bluebird.all([
                    db_helper.writeColorMeasurement(colour),
                    db_helper.setLastColor(colour),
                    ds_helper.writeColour(colour)
                ]);
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

exports.onConveyorStateChanged = function (req, res) {
    let conveyorState = req.body.Items[0].Value.DigitalInputState;

    db_helper.setLastConveyorState(conveyorState)
        .catch((err) => {
            console.error(err);
        });
};

exports.clientConnected = function (req, res) {

    if (req.body.Items.length === 0) {
        return;
    }
    var items = req.body.Items[0];
    var subscription = items.Links.filter(element => {return element.rel === "client";});
    if (subscription.length === 0) {
        console.error("[onClientUpdated] Could not find client url!");
        return;
    }

    return ds_helper.getClients()
        .then((response) => { //request clients and find one matching subscription id
            var clients = response.body.Items;
            var filteredClients = clients.filter(function (c) {
                var href = subscription[0].href;
                var links = c.Links.filter(function (l) {
                    return l.href.indexOf(href) !== -1;
                });
                return links.length > 0;
            });

            return filteredClients[0];
        })
        .then((c) => {
            if (c.Name === config.conveyor_controller_client_name) {
                ds_helper.subscribeToObservation(config.conveyor_controller_client_name, 3200, 0, 'DigitalInputState', config.host + '/notifications/conveyor_state_changed')
                    .then((response) => {
                        console.log("Succesfully subscribed to IPSO digital Input object");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                synchronization_helper.trySynchronizeConveyorState();
            } else if (c.Name === config.color_detector_client_name) {
                ds_helper.subscribeToObservation(config.color_detector_client_name, 5706, 0, 'Color', config.host + '/notifications/color_changed')
                    .then((response) => {
                        console.log("Succesfully subscribed to IPSO Color object");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                //synchronization_helper.trySynchronizeConveyorState();
            }
            if (c.Name === config.color_detector_client_name) {
                ds_helper.subscribeToObservation(config.color_detector_client_name, 3335, 0, 'Colour', config.host + '/notifications/color_changed')
                    .then((response) => {
                        console.log("Succesfully subscribed to IPSO colour object");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch(error => {
            console.error(error);
        });
};

