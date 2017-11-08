(function () {
    "use strict";

    var Cloudant = require("../setup/CloudantCredentials").init;

    module.exports = function (collectionName) {
        Cloudant.db.create(collectionName, function (err, res) {
                if (err) {
                        console.info('Database '+ collectionName + ' already exists');
                }
        });
        
        var db = Cloudant.db.use(collectionName);
        return {
        	"auth" : function(){
        		return Cloudant.exportedCredentials;
        	},
        	"endpoint": Cloudant.endpoint,
            "create": function (payload) {
                return new Promise(function (resolve, reject) {
                    db.insert(payload, function(err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            },
            "get": function (query) {
                return new Promise(function (resolve, reject) {

                    if (!query) {
                        return reject("Invalid query");
                    }

                    db.find(query, function (err, items) {
                        if (err) {
                            reject({
                                "status": 500,
                                "message": err
                            });
                        }
                        resolve(items);
                    });
                });
            },
            "getAll": function (params) {
                return new Promise(function (resolve, reject) {
                    db.list(params, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            },
            "delete": function (docId, docRev) {
                return new Promise(function (resolve, reject) {
                    db.destroy(docId, docRev, function (err) {
                        if (err) {
                            reject(err);
                        }
                        resolve(["Document:", docId, "from:", collectionName, "deleted successfully"].join(" "));
                    });
                });
            }
        };

    }

}());