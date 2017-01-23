const ds_helper = require("../helpers/ds_helper");
const db_helper = require("../helpers/db_helper");
const bluebird = require('bluebird');

exports.onColorChanged = function (req, res) {
    let colour = req.body.Items[0].Value.Colour;

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

