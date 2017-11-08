"use strict";

module.exports = function (app, { passport, jwt }) {

    app.get("/", function (req, res) {
        return res.status(200).render("login", {
            user: req.user || ""
        });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        if (req.user)
            res.status(200).json({ user: req.user, token: jwt.signToken(req.user) });
        else
            res.status(401).json({ error: 'Incorrect credentials' });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.status(200).json({});
    });
};
