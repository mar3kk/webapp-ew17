/**
 * Change the name from: config.sample.js -> config.js. In this file are defined 
 * the configuration variables for the Embedded Word Demo 2017 - conveyor belt 
 * with color detection. 
 * 
 * -----------------------------------------------------------------------------
 * The complete aplication uses 3 micro-services orchestraded by Docker Compose:
 * 
 * 1- Node.js webapp
 * 2- Influx DB
 * 3- Grafana
 * 
 * -----------------------------------------------------------------------------
 * The end user needs to define:
 * 
 * 1- url -> Device server instance
 * 2- API access keys (Dev console):
 * * 2.1- access_key
 * * 2.2- access_secret
 * 3- host- http://IP:3001 address from the machine where this webapp is running. 
 * This is used to create the subscriptions on the device server. The IP addr 
 * should be accessible by the device server instance, (Public/Private) use 
 * Proxy if necessary. 
 * 
 * -----------------------------------------------------------------------------
 * Help:
 * @Marek_Kubiczek
 * @Hugo_Santos
 * 
 */

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
    conveyor_controller_client_name: "ColorDetector",
    // your host on which app is running, necessary to set subscription uri
    host: "https://ngrok_URL",
    allowed_colors: ["none", "red", "green", "blue", "yellow"]
};