# ThroughPuter, Inc. Estimator Microservice Demo Applications

Demo applications utilizing the [Throughputer Inc.](http://www.throughputer.com) [Estimator microservice](https://www.estimatorlab.com).

## Installation

This package use npm (Node.js Package Manager). With npm installed, run `npm install` in this repository directory.

## Rock-Paper-Scissors

### Running the Demo

A live version of this demo and others can be found [here](https://www.estimatorlab.com).

To run the demo locally, simply open the `index.html` file in your web browser (after [installation](#Installation), above). For example, use URL: `file:///path-to-repo-dir/rps/index.html`.

## Connecting the Estimator Microservice

The Estimator URL with access key is specified near the top of `js/rps.js`. (See [Estimator API](https://github.com/throughputer/estimator_lib) for more info about the access key.)

**IMPORTANT NOTE**: This demo accesses the WebSocket from the client and therefore exposes its JavaScript code to users in their web browsers. While this demo application demonstrates proper use of the microservice, to access a private Estimator, your application code must keep your secret key secret (such as connecting through your own private web server). You should not expose this demo publicly with your private key.
