const config = require("../config");
const creator = require("creator-js-client")(config.device_server.access_key, config.device_server.access_secret);
const bluebird = require("bluebird");

exports.subscribeToObservation = function(clientName, objectID, instanceID, property, url, callback) {
    const promise = creator.request(
        {
            steps: ['clients', { Name: clientName }, 'objecttypes', { ObjectTypeID: objectID.toString() }, 'instances', { InstanceID: instanceID.toString() }, 'subscriptions'],
            method: 'POST',
            nocache : true,
            data: {
                'SubscriptionType': 'Observation',
                'Url': url,
                'Property': property,

            }
        })
        .then((response) => {
            switch (response.statusCode) {
                case 409:
                    console.log("Failed to subscribe to %s observation on object %d/%d. Already subscribed.", property, objectID, instanceID);
                    return bluebird.reject(null);
                case 200:
                case 201:
                case 204:
                    console.log("Successfully subscribed to %s on object %d/%d observation.", property, objectID, instanceID);
                    return bluebird.resolve(null);
                default:
                    console.error("Failed to subscribe to %s observation on object %d/%d. Server responded with : %d", property, objectID, instanceID, response.statusCode);
                    return bluebird.reject(null);
            }
        },
        function (err) {
            console.error("Failed to subscribe to %s on object %d/%d observation. %s", property, objectID, instanceID, err);
            return bluebird.reject(err);
        });
    if (callback) {
        return promise.nodeify(callback);
    } else {
        return promise;
    }
};
