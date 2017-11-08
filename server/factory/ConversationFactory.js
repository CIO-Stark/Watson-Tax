(function () {
    "use strict";

    var watsonConversation = require("watson-developer-cloud/conversation/v1"),
        conversationCredentials = require("../setup/ConversationCredentials");

    module.exports = function () {
        if (!conversationCredentials) {
            throw new Error("Can not proceed without service credentials object");
        } else {
            var conversationInstance = new watsonConversation(conversationCredentials.creds);
        }

        
        var convApiCall = function(options){
            return new Promise(function(resolve, reject){
                conversationInstance.message(options, function (err, response) {
                    if (err) {
                        console.log("convApiCallError", err);
                        reject(err);
                    } else {
                        console.log("convApiCallSuccess", response);
                        resolve(response);
                    }
                });
            });
        }

        return {

            /**
             * split messages to arrays with maximum of 2048 chars
             * Remembering that it cannot split in the middle of a word
             * otherwise we would use str.match(/.{2048}/g))
             */
            messageSplit: (message, size) => {
                var chunks = [];
                 
                    // TODO corrigir break when it is in the middle of a word
                    /*var lastSpacePos = -1;
                    var msg = '';
                    var msgLimits = 0;
                    for (let i = 0; i < message.length; i ++) {
                        if(message.charAt(i) == ' ') lastSpacePos = i;
                        msg += message.charAt(i);
                        chunks.push(str.substring(i, i + 3));
                        if(i % 2048){
                            msgLimits++;  // count how many blocks of 2048 chars

                        } 
                }*/
                
                var replace = ".{1," + size + "}";
                var re = new RegExp(replace,"g");
                return message.match(re);
                
                //return message.match(/.{1,6}/g)
            },

            sendMessageArr: (arr,ctx) => {
                return new Promise((resolve, reject) => {
                    var dataPromises = [];
                    arr.forEach(value => {  //for each entry to be sent to conversation
                        console.log(value);
                        var options = {
                                    "input": {
                                        "text": value
                                    },
                                    "context": ctx ? ctx : {},
                                    "workspace_id": conversationCredentials.creds.workspace_id
                        }
                        dataPromises.push(convApiCall(options));
                    })   
            
                    Promise.all(dataPromises).then(function(data){
                        // console.log("sendMessageAr response", data);
                        resolve(data);
                    }).catch(function(error){
                        console.error(error);
                        reject(error);
                    });
                })
            },
            sendMessage: function (options) {
                return new Promise(function (resolve, reject) {
                    if (!options) {
                        return reject("Can not proceed without options object");
                    }


                    options.workspace_id = conversationCredentials.creds.workspace_id;
                    
                    console.log(options);

                    
                    conversationInstance.message(options, function (err, response) {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        } else {
                            return resolve(response);
                        }
                    });
                        


                });
            }
        }
    };

}());