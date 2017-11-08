"use strict";

module.exports = function (app, env) {

    var fs = require("fs"),
        cfenv = require("cfenv"),    
        appEnv = cfenv.getAppEnv(),
        request = require("request"),
        request = require('request'),
        Promise = require('bluebird'),
        passport = require("passport"),
        bodyParser = require("body-parser"),
        jwt = require('./jwt'),
        nluFactory = require('./factory/nlu.factory.js')(),
        convFactory = require('./factory/conversation.factory.js')(),
        // cloudantFeedbackFactory = require('./factory/cloudant.factory.js')("watsontax_feedback"),
        cloudantCrawlerFactory = require('./factory/cloudant.factory.js')("watsontax_crawler"),
        cloudantUsersFactory = require('./factory/cloudant.factory.js')("watsontax_users");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({limit: "50mb"}));

    require("./routes.js")(app, {
        fs: fs,
        request: request,
        Promise: Promise,
        conversation: convFactory,
        nlu: nluFactory,
        jwt: jwt,
        // cloudantFeedback: cloudantFeedbackFactory,
        cloudantCrawler: cloudantCrawlerFactory,
        cloudantUsers: cloudantUsersFactory,
        passport: passport,
        appEnv: env
    });

};