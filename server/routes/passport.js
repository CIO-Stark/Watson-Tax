"use strict";

var LocalStrategy = require("passport-local").Strategy;

function _validateUser (username, password, cloudant) {
    return new Promise((resolve, reject) => {
        cloudant.get({ selector: { _id: username } })
        .then(({ docs }) => {
            const user = docs[0];

            if (user && user.password === password) resolve({ email: user._id, role: user.role });
            else reject({ message: 'Incorrect credentials' });
        })
        .catch(error => {
            console.error('Validating user: ', error);
            reject(error);
        });
    });
}

module.exports = function (app, { passport, cloudant }) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));

    passport.deserializeUser((user, done) => done(null, user));

    passport.use(new LocalStrategy({ session: false }, function (username, password, done) {
        _validateUser(username, password, cloudant)
        .then(user => done(null, user))
        .catch(error => done(null, false, { message: 'Incorrect credentials', error: error }));
    }));
};
