const ds_helper = require('./ds_helper');
const db_helper = require('./db_helper');

exports.trySynchronizeConveyorState = function () {
    ds_helper.getConveyorState()
        .then((result) => {
            if (result === true || result === false) {
                db_helper.setLastConveyorState(result);
            }
        })
        .catch((err) => {
            console.error(err);
        });
};