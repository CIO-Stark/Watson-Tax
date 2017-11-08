"use strict";

module.exports = function (app) {
    var nlu = require("../factory/nlu.factory");

//process text throug NLU directly
    app.post("/nlu/text", function (req, res) {
        var text = req.body.text || false;
        if(text){
            nlu.processText(text).then(function(data){
                res.send({
                    status: true,
                    data: data
                });
            }).catch(function(error){
                res.send({
                    status: false,
                    error: error,
                    message: "nlu:text -> error"
                });
            });
        }
        else{
            res.send({
                status: false,
                message: "nlu:text -> invalid text"
            });
        }
    });
};
