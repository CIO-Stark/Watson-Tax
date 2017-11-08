"use strict";

module.exports = function (app, { cloudant, jwt }) {
    const validateToken = jwt.verifyMiddleware;

    //post feedback
    app.post("/feedback", validateToken, (req, res) => {
        var card = req.body;
        card._rev = undefined;
        card.feedbackTime = new Date();
        card.feedbackUser = req.user.email;
        
        cloudant.create(card).then(data => {
            console.log(data);
            res.send({status: true, data: data});
        }).catch(error => {
            console.error(error);
            res.status(500).send({status: false, error: error});
        });
    });

    
    //post feedback
    app.delete("/feedback", validateToken, (req, res) => {
        cloudant.delete(req.body._id, req.body._rev).then(data => {
            console.log(data);
            res.send({status: 'ok'});
        }).catch(error => {
            res.status(500).send({error: error});
        });
    });

    /**
     * retrieve list with feedbacks applied
     */
    app.get("/feedbackList", validateToken, (req, res) => {
        cloudant.get({
            "selector": {
                "feedbackStatus":  {
                    "$exists": true
                }, "feedbackData": "created"
            } //,"fields": ["id"]
            }, { include_docs: true }).then(items => {
            var returnJson = items.docs; // converting the .rows that comes from cloudant to the format acceptable by the bootstrap table
            console.log('Qtd: ', returnJson);
            res.status(200).json(returnJson);
        }).catch(error => {
            res.status(500).json({error: error})
        });
    });
};
