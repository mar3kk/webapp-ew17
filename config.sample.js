module.exports = {
    device_server : {
        url: "https://deviceserver.cretordev.io",
        access_key : '<access_key>',
        access_secret : '<access_secret>'
    },
    // influx db configuration
    database : {
        uri : "localhost:8086",
        name : "ew17"
    },
    // name of the client responsible for detecting blocks colours
    color_detector_client_name: "ColorDetector",
    // name of the client responsible for controlling conveyor belt
    conveyor_controller_client_name: "ConveyorController",
    // your host on which app is running, necessary to set subscription uri
    host: "https://ngrok_URL",
    allowed_colors: ["none", "red", "green", "blue", "yellow"]
};