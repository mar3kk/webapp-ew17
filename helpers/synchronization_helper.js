const ds_helper = require('./ds_helper');
const db_helper = require('./db_helper');

exports.trySynchronizeConveyorState = function () {
    return ds_helper.getConveyorState()
        .then((result) => {
            if (result === true || result === false) {
                db_helper.setLastConveyorState(result);
            }
        })
        .catch((err) => {
            db_helper.setLastConveyorState(false);
            console.error(err);
        });
};