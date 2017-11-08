"use strict";

module.exports = function(setup){
    var nlu = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var credentials = setup;

/*
    if(process.env.VCAP_SERVICES){
        var vcap = JSON.parse(process.env.VCAP_SERVICES);
        credentials = vcap["natural-language-understanding"][0].credentials;
    }
*/

    return new nlu({
        username: process.env.nluUser,
        password: process.env.nluPassword,
        url: process.env.nluURL,
        version_date: nlu.VERSION_DATE_2016_01_23
    });
};