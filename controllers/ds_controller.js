const ds_helper = require("../helpers/ds_helper");
const db_helper = require("../helpers/db_helper");
const config = require('../config');
const bluebird = require('bluebird');

exports.onColorChanged = function (req, res) {
    let colour = req.body.Items[0].Value.Colour;

    if (colour === "none") {
        db_helper.setLastColor(colour);
        return;
    }

    let allowedColor = false;

    config.allowed_colors.every(function (element) {
        if (colour === element) {
            allowedColor = true;
            return false;
        }
    });

    if (allowedColor === false) {
        console.error("Invalid color : %s", colour);
    }

    db_helper.getLastColor()
        .then((lastColor) => {
            if (lastColor === colour) {
                return bluebird.reject("Got duplicated notification from device server");
            } else {
                return bluebird.all([
                    db_helper.writeColorMeasurement(colour),
                    db_helper.setLastColor(colour)
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

