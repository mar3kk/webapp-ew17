const Influx = require('influx');
const config = require('../config');

const influx = new Influx.InfluxDB({
    host: 'localhost',
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
        }
    ]
});

influx.createDatabase(config.database.name)
    .catch((err) => {
        console.error(err);
    });


exports.writeColor = function (color) {
    influx.writePoints([
        {
            measurement: 'detected_colors',
            tags: { color_tag: color },
            fields: { color: 1 },
        }
    ])
    .catch((err) => {
        console.error(err);
    });
};
