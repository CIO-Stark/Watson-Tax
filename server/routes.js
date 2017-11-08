"use strict";

module.exports = function (app, modules) {
    require("./routes/passport")(app, { passport: modules.passport, cloudant: modules.cloudantUsers });
    require("./routes/nlu")(app, modules);
    require("./routes/feedback")(app, { cloudant: modules.cloudantCrawler, jwt: modules.jwt });
    require("./routes/login")(app, { passport: modules.passport, jwt: modules.jwt });
    require("./routes/main_data")(app, modules);
    require("./routes/crawler_data")(app, modules.cloudantCrawler, modules.express);

    const validateToken = modules.jwt.verifyMiddleware;

    app.get('/home', validateToken, (req, res) => {
        res.status(200).json(req.user);
    });
};
