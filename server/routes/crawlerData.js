/**
 * handle crawler database dump
 */
(function () {
    "use strict";

    module.exports = function (app, cloudant, express) {
        /*var userRouter = express.Router();
        var itemRouter = express.Router({mergeParams: true});
        app.use('/crawlerData', userRouter);
        userRouter.use('/:userId/items', itemRouter);
        TODO Nested router: https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router
        */

        /**
         * return the main data for the screen report
         * category: Leis, Artigos, etc
         * Region: federal, municipal, estadual
         */
        app.post("/crawlerData/:size", function (req, res) {
                if (!req.body.filter)
                    res.status(500).send({ error: 'filter is not present' });

                let filter = JSON.parse(req.body.filter);

                // the data cannot exists in feedback documents (in this case they were already processed)
                // filter must match in order to return data
                let query = {
                    "selector": {
                        "category": filter.atos || "-",
                        "location": filter.region || "-",
                        "feedbackData": {
                            "$exists": false
                        }, "body": {
                            "$regex": filter.keywords ? "(?i)"+filter.keywords : ""
                        }
                        
                    }, 
                    "sort": [{"date": "asc"}],
                    "limit": req.params.size ? Number(req.params.size) : 100
                };

                


                if(filter.startDate || filter.endDate)
                    query.selector.date = {};
                if(filter.startDate)
                    query.selector.date.$gt = filter.startDate;
                if(filter.endDate)
                    query.selector.date.$lt = filter.endDate;

                if(filter.region && filter.region === 'Estadual'){
                    query.selector.uf = filter.state;
                }
                if(filter.region && filter.region === 'Municipal'){
                    query.selector.uf = filter.state;
                    query.selector.city = filter.city || false;
                }

                
                console.log(JSON.stringify(query, null, 2));
                cloudant.get(query).then(items => {
                    var returnJson = [];
                    returnJson = items.docs;

                    res.send(JSON.stringify(returnJson, null, 3));

                }).catch(error => {
                    res.status(500).send({ error: error })
                });
            }
        );

        /**
         * for debug: return a grouped view of the crawler data
         */
        app.post("/crawlerStatus", function (req, res) {
            let filter = {
                category: req.body.category || false,
                location: req.body.location || false,
                feedback: req.body.feedback || false
            };
                // the data cannot exists in feedback documents (in this case they were already processed)
                let query = {
                    "selector": {}
                    
                };
                if(filter.category) query.selector.category = filter.category;
                if(filter.location) query.selector.location = filter.location;
                console.log("query", query);

                
                cloudant.get(query).then(items => {
                    let cat = {};
                    let catLocation = {};
                    let location = {};
                    let returnJson = {};

                    items.docs.forEach(article => {
                        if(!cat[article.category])
                            cat[article.category] = {count: 0};
                        else cat[article.category].count += 1;

                        if(!catLocation[article.category + '-' + article.location])
                            catLocation[article.category + '-' + article.location] = {count: 0};
                        else catLocation[article.category + '-' + article.location].count += 1;

                        if(!location[article.location])
                            location[article.location] = {count: 0};
                        else location[article.location].count += 1;
                    });
                    returnJson.category = cat;
                    returnJson.location = location;
                    returnJson.categoryRegion = catLocation;
                    res.send(JSON.stringify(returnJson, null, 3));

                }).catch(error => {
                    res.status(500).send({ error: error })
                });
            }
        );




    };
}());