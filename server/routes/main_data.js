"use strict";

module.exports = function (app, modules) {
    const validateToken = modules.jwt.verifyMiddleware;

    /**
     * return the main data for the screen report
     */
    app.get("/data", validateToken, (req, res) => {
        //let data = modules.fs.readFileSync('./json/dataSmall.json');
        let data = modules.fs.readFileSync('./json/data.json');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // the data cannot exists in feedback storage documents (in this case they were already processed)
        modules.cloudant.get({
            "selector": {
                "manualAnalyse":  {
                    "$exists": true
                }
            },
            "fields": ["id"]
            }).then(items => {
            var returnJson = {};
            returnJson.rows = [];
            JSON.parse(data).rows.forEach(article =>{
                let exists = false;
                items.docs.forEach(item => {
                    if(article.id == item.id)
                        exists = true;
                });
                if(!exists)
                    returnJson.rows.push(article);
            });

            res.send(JSON.stringify(returnJson, null, 3));
        }).catch(error => {
            res.status(500).send({error: error})
        });
    });

    /**
     * parsed / data with conversation used for testing purpose
     */
    app.get("/parsedMock", (req, res) => {
        let data = modules.fs.readFileSync('./json/parsedData.json');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        res.statusCode = 200;
        res.end(data);
    });

    /**
     * parsed / data with conversation used for testing purpose
     */
    app.get("/dataTest", (req, res) => {
        let data = modules.fs.readFileSync('./json/dataTest.json');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        res.statusCode = 200;
        res.end(data);
    });

    /**
     * call conversation api for entities and intents extract
     * @param {*} jsonResenha
     * 
     */
    var conversationCall = function (jsonResenha, context) {
        /**
         * split messages to reach conversation maximum size
        */
        return new Promise((resolve, reject) => {
            var conversationSize = 2048;
            modules.conversation.sendMessageArr(
                modules.conversation.messageSplit(jsonResenha.body, conversationSize), context).then(function (data) {
                    /**
                     * it will interact in the data, which returns an array of all the Conversation API responses
                     * So for instance, if a message has 3000 chars, it will return 2 Conversation Responses
                     * one of the first 2048 and other with the 900and something chars
                     * But this function will "aggregate" all the entities/intents in the same final data
                     * so it will response a single object independently of the message sent to conversation
                     * 
                     */
                    var conversation = {};
                    let allIntents = []; // contains intents of all conversation API returns for the same splited body
                    let allEntities = []; //same as above
                    let output = {};
                    output.text = [];
                    let ctx;
                    /**
                     * count will see the array index and multiply per conversationSize so it can 
                     * get the right position of each entity
                     * Conversation returns entity like: 
                     * {
                     *       "entity": "words",
                     *       "location": [
                     *           1159,
                     *           1182
                     *       ],
                     *       "value": "important",
                     *       "confidence": 1
                     *   }
                     * 
                     * so we need to mannualy Add the count*conversationSize to the begin/end position in order
                     * to identify the entity in the message even then it is part of the array (because of the Conversation API max lenght)
                     */
                    let count = 0;
                    let pesoRelevante = 0;
                    let entities = {};
                    data.forEach(element => {
                        element.entities.forEach(entity => {
                            entity.location[0] = entity.location[0] + (count*conversationSize);
                            entity.location[1] = entity.location[1] + (count*conversationSize);
                            allEntities.push(entity);

                            if(!entities[entity.entity])
                                entities[entity.entity] = {
                                    words:[element.input.text.substring(entity.location[0], entity.location[1]).replace(/  +/g, ' ')],
                                    meaning: entity.entity.indexOf("include")!= -1? "include" : "exclude"
                                };
                            else{
                                let word = element.input.text.substring(entity.location[0], entity.location[1]);
                                if(entities[entity.entity].words.indexOf(word.replace(/  +/g, ' ')) == -1)
                                    entities[entity.entity].words.push(word.replace(/  +/g, ' '));
                            }
                        });
                        element.intents.forEach(intent => {
                            allIntents.push(intent);
                        });
                        
                        // conversation response
                        /**
                         * conversation api responses contains the {{positive}} or {{negative}}
                         * depending on the analyses that were made for EACH response
                         */
                        if(element.output.text.length)
                            element.output.text.forEach(text => {
                                if(text.indexOf("{{positive}}") == -1 && text.indexOf("{{negative}}") == -1)
                                    return; // since there are texts that are used for debug and should not appears here
                                
                                /**
                                 * verifies if the analyze text exists
                                 * It may be duplicated since the same message was broken into small pieces to be processed 
                                 * by Conversation API so the same analyze could return twice... In this case, ignore the duplicates
                                 */
                                if(!output.text.some(analyzeText => {
                                    if(analyzeText.text === text.replace("{{positive}}", "").replace("{{negative}}",""))
                                        return true;
                                })){
                                    output.text.push({meaning: text.indexOf("{{positive}}")!= -1?"positive" : "negative",
                                                        text: text.replace("{{positive}}", "").replace("{{negative}}",""),
                                                        fullTextIndex: count
                                    });
                                }
                            });
                        //output.text.push(element.output.text); 
                        if(element.context.hasOwnProperty("pesoRelevante"))
                            pesoRelevante += element.context.pesoRelevante;
                        ctx = element.context; // conversation context



                        count++;
                    });
                    /**
                     * weight will return from conversation but since that same message could be split in X api calls (due to max size)
                     * it will divide the value by its size to get an normalized weight
                     */
                    ctx.pesoRelevante = pesoRelevante / data.length;

                    conversation.intents = allIntents;
                    conversation.entities = allEntities;
                    conversation.context = ctx;
                    conversation.response = output;

                    conversation.finalEntities = entities;
                    resolve(conversation);

                }).catch(function (error) {
                    console.error(error);
                    reject(error);
                });
        });
    }

    /**
     * invoke nlu
     * @param {} text 
     */
    var nluCall = function (text) {
        return new Promise((resolve, reject) => {
            modules.nlu.processText(text).then(function (data) {
                //console.log(data);
                resolve(data);
            }).catch(function (error) {
                reject(error);

            });
        });
    }


    /**
     * get all resenhas collected by crawler in its normalized metadata json
     * and add watson conversation and NLU attributes
     */
    app.post("/parsedData/:size", validateToken, (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        var parsedResponse = [];
        var startPromises = [];

        if(!req.body)
            res.status(500).send({ error: 'filter is not present' });
        
        let url;

        url = modules.appEnv.url + '/crawlerData/' + req.params.size;
        console.log('Making GET request to', url);
        modules.request.post(
            {
                url: url, // retrieve the resenhas stored
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'encoding': 'utf-8'
                },
                body: "filter=" + JSON.stringify(req.body)
            },
            function (err, response, body) {
                if (err) {
                    console.error(err);
                } else {
                    var json = JSON.parse(response.body);
                    console.log("Quantidade de resenhas", json.length);
                    /**
                     * for each resenha found by crawler
                     */
                    var count = 0;

                    var promiseWhile = require('promise-while')(modules.Promise)
                    promiseWhile(function () {
                        /**
                         * keep calling sendMessageArr while json length was not achieved
                         * then call "done" function at the end
                         */
                        return count < json.length;
                    }, function () {
                        var dataPromises = [];

                        return new Promise((resolve, reject) => {
                            dataPromises.push(conversationCall(json[count]));

                            dataPromises.push(nluCall(json[count].body));

                            Promise.all(dataPromises).then(function (data) {
                                json[count].conversation = data[0]; //first conversation -> get main entities

                                json[count].nlu = data[1];

                                parsedResponse.push(json[count]);
                                console.log("Promise All Success"); //, data);
                                count++;
                                resolve(data);
                            }).catch(function (error) {
                                console.error(error);
                                count++;
                                reject(error);
                            });
                        });


                    }).then(function () {
                        console.log("Done");

                        // once conversation returns, will get its entities and data
                        // and resend to calculate final answer
                        var context = {};

                        /**
                         * count how many times entity appears
                        **/
                        var dataPromises = [];
                        var countInclude = 0;
                        var countExclude = 0;
                        parsedResponse.forEach(finalJson => {
                            if (finalJson.conversation.context)
                                context = finalJson.conversation.context;
                            finalJson.conversation.entities.forEach(entity => {
                                /**
                                 * send to watson a simple sum of the include/exclude entities
                                 * for a basic comparison of weights
                                 */
                                if (entity.value.indexOf('include') != -1)
                                    countInclude++;
                                else if (entity.value.indexOf('exclude') != -1)
                                    countExclude++;

                                /**
                                 * create context with variables to be sent to Conversation
                                 */
                                let countKey = entity.entity + '-' + entity.value;
                                if (!context[countKey])
                                    context[countKey] = 1;
                                else context[countKey]++;
                            });
                            //context['countInclude'] = countInclude;
                            //context['countExclude'] = countExclude;

                            // call Conversation with an empty text and the variables in the context
                            //console.log("Sending to Conversation API", context);
                            //dataPromises.push(conversationCall({ body: "----" }, context));


                        });
                        /**
                         * get final responses from Conversation
                         * ->responses that comes after we send the identified Entities
                         */
                        // let index = 0;
                        // Promise.all(dataPromises).then(data => {
                        //     /**
                        //      * considering same order of parsedResponse
                        //      * append the finalConversation value coming from API Call
                        //      */
                        //     parsedResponse.forEach(finalJson => {
                        //         finalJson.finalConversation = data[index++];
                        //     });
                        //     //console.log(parsedResponse);
                        //     var respJson = [];
                        //     respJson = parsedResponse;


                        //     res.end(JSON.stringify(respJson, null, 3));
                        // }).catch(error => {
                        //     console.error(error);
                        //     res.end({ rows: [] });
                        // });
                        res.end(JSON.stringify(parsedResponse, null, 3));



                    });

                }
            });
    });
};
