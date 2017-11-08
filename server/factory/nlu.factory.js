"use strict";

module.exports = function(){
    var nlu = require('../setup/nlu_credentials')();

    //send text to NLU
    var processText = function(text, delay){
        delay = delay || 20;
        return new Promise(function(resolve, reject){
            if(text !== ""){
                setTimeout(function(){
                    // 'features': {
                    //         "sentiment": {},
                    //         "entities": {},
                    //         "relations": {},
                    //         "categories": {}
                    //     }
                    nlu.analyze({
                        'text': text,
                        'features': {
                            "categories": {}
                        }
                    }, function (error, data) {
                        if (error) {
                            console.log("processText error", error.message);
                            reject(error);
                            
                        }
                        else{
                            resolve(data);
                        }
                    });    
                }, delay);
            }
            else{
                resolve(false);
            }
        });
    };

    //get keywords from NLU
    var processKeyword = function(text, delay){
        delay = delay || 20;
        return new Promise(function(resolve, reject){
            if(text !== ""){
                setTimeout(function(){
                    nlu.analyze({
                        'text': text,
                        'features': {
                            "keywords": {}
                        }
                    }, function (error, data) {
                        if (error) {
                            console.log("processKeyword error", error.message);
                            resolve(false);
                            /*
                            reject({
                                api: "nlu:processKeyword",
                                message: error.message
                            });
                            */
                        }
                        else{
                            resolve(data);
                        }
                    });
                }, delay);
            }
            else{
                resolve(false);
            }
        });
    };

    //send url to NLU
    var processUrl = function(url, delay){
        delay = delay || 20;
        return new Promise(function(resolve, reject){
            if(text !== ""){
                setTimeout(function(){
                    nlu.analyze({
                        'url': url,
                        'features': {
                            "sentiment": {},
                            "entities": {},
                            "categories": {},
                            "keywords": {}
                        }
                    }, function (error, data) {
                        if (error) {
                            resolve(false);
                            /*
                            reject({
                                api: "nlu:processUrl",
                                message: message.error
                            });
                            */
                        }
                        else{
                            resolve(data);
                        }
                    });
                }, delay);
            }
            else{
                resolve(false);
            }
        });
    };

    return {
        processText: processText,
        processKeyword: processKeyword,
        processUrl: processUrl
    };
};