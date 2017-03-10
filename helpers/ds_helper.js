const config = require("../config");
const creator = require("creator-js-client")(config.device_server.access_key, config.device_server.access_secret, { host: config.device_server.url });
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

exports.subscribeToClientConnectedEvent = function (url, callback) {
    const promise = creator.request(
        {
            steps: ['subscriptions'],
            method: 'POST',
            data: {
                'SubscriptionType': 'ClientConnected',
                'Url': url
            },
            nocache : true
        });

    return promise.nodeify(callback);
};

exports.getPropertyValue = function (clientName, objectID, instanceID, property, callback) {
    const promise = creator.request(
        {
            steps: ['clients', {Name: clientName}, 'objecttypes', {ObjectTypeID: objectID.toString()}, 'instances', {InstanceID: instanceID.toString()}],
            method: 'GET',
            nocache : true
        })
        .then((response) => {
            if (response.statusCode == 200) {
                return response.body[property];
            } else {
                return null;
            }
        });
    if (callback) {
        return promise.nodeify(callback);
    } else {
        return promise;
    }
};


exports.setPropertyValue = function (clientName, objectID, instanceID, property, value, callback) {
    const promise = creator.request(
        {
            steps: ['clients', {Name: clientName}, 'objecttypes', {ObjectTypeID: objectID.toString()}, 'instances', {InstanceID: instanceID.toString()}],
            method: 'PUT',
            data: {
                [property]: value
            },
            nocache : true
        })
        .then((response) => {
            if (response.statusCode == 200) {
                return response.body[property];
            } else {
                return null;
            }
        });
    if (callback) {
        return promise.nodeify(callback);
    } else {
        return promise;
    }
};

exports.getConveyorState = function () {
    return this.getPropertyValue(config.conveyor_controller_client_name, 3200, 0, 'DigitalInputState');
};

exports.getClients = function () {
    return creator.request({ steps: ['clients'] });
};

exports.writeColour = function (colour) {
    console.log("Writing colour %s to bulb controller", colour);
    this.setPropertyValue(config.bulb_controller_client_name, 3311, 0, "Colour", colour)
        .catch((error) => {
            console.error("failed to write colour %s to bulb controller. %s", colour, error);
        });
};
