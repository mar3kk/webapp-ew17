const Influx = require('influx');
const config = require('../config');

const influx = new Influx.InfluxDB({
    host: config.database.uri,
    database: config.database.name,
    schema: [
        {
            measurement: 'detected_colors',
            fields: {
                color: Influx.FieldType.STRING,
            },
            tags: [
                'color_tag'
            ]
        },
        {
            measurement: 'conveyor_state',
            fields: {
                state: Influx.FieldType.INTEGER
            },
            tags : []
        },
        {
            measurement: 'last_color',
            fields: {
                color: Influx.FieldType.STRING,
            },
            tags : []
        },
        {
            measurement: 'last_conveyor_state',
            fields: {
                state: Influx.FieldType.BOOLEAN,
            },
            tags : []
        }
    ]
});

influx.createDatabase(config.database.name)
    .catch((err) => {
        console.error(err);
    });



exports.writeColorMeasurement = function (color) {
    influx.writePoints([
        {
            measurement: 'detected_colors',
            tags: { color_tag: color },
            fields: { color: color },
        }
    ])
    .catch((err) => {
        console.error(err);
    });
};

exports.writeConveyorStateMeasurement = function (state) {
    influx.writePoints([
        {
            measurement: 'conveyor_state',
            tags: {},
            fields: { state: state === true ? 1 : 0 },
        }
    ])
    .then(() => {
        console.log("saved conveyor_state : %s", state ? 1 : 0);
    })
    .catch((err) => {
        console.error(err);
    });
};

exports.setLastColor = function (color) {
    return influx.dropSeries({
        measurement: m => m.name('last_color')
    })
        .then((response) => {
            return influx.writePoints([
                {
                    measurement: 'last_color',
                    fields: { color: color }
                }
            ]);
        });
};

exports.getLastColor = function () {
    return influx.query(`
        select * from last_color
            order by time desc
            limit 1
            `)
        .then(rows => {
            if (rows.length === 0) {
                return "none";
            } else {
                return rows[0].color;
            }
        });
};

exports.setLastConveyorState = function (state) {
    return influx.dropSeries({
        measurement: m => m.name('last_conveyor_state')
    })
        .then((response) => {
            return influx.writePoints([
                {
                    measurement: 'last_conveyor_state',
                    fields: { state: state }
                }
            ]);
        })
        .catch(() => { });
};

exports.getLastConveyorState = function () {
    return influx.query(`
        select * from last_conveyor_state
            order by time desc
            limit 1
            `)
        .then(rows => {
            if (rows.length === 0) {
                return false;
            } else {
                return rows[0].state;
            }
        });
};
