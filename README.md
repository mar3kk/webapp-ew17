![logo](https://static.creatordev.io/logo-md-s.svg)

# Embedded World 2017 - web app

## Overview

This web app works as a proxy and stats collector for other demo components.

## Running in docker

* Clone this repository
* `cp config.js.sample config.js`
* Edit config.js file
    * In device server section set url and keys to device server you're suing
    * In database section set URI and database name for your InfluxDB 
    * Set client names as described in comments
    * Set url of host on which app is running. This will be used bu device server to trigger webhooks.
* start the app `docker-compose build && docker-compose up -d`