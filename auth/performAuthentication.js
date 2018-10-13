"use strict";
const passport = require('passport');
const entitlements = require('../util/entitlements.js');
const profileUtil = require('../util/profileUtil.js');

const providers = [
    require('./provider/google.js'),
    require('./provider/facebook.js'),
    require('./provider/linkedin.js'),
    require('./provider/reddit.js'),
    require('./provider/twitter.js')
];
var callbackOptions = require('./callbackOptions.js');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = function (app)
{
    console.log("Registering authentication providers -> starting");
    providers.forEach(function (provider)
    {
        console.log("-> provider: %s", provider.name);
        passport.use(provider.strategy);
        var tokenLookup = passport.authenticate(provider.name, provider.tokenOptions);
        var profileLookup = passport.authenticate(provider.name, {failureRedirect: '/login', session: true});

        // app.get parameters - first is path, second is thing to return
        app.get(provider.tokenRoute, tokenLookup);
        app.get(provider.callbackRoute, profileLookup, function (req, res)
        {
            var user = req.user;
            var role = (user.role) ? user.role : entitlements.defaultRole();
            user.actions = entitlements.permittedActions(role);
            var route = "/";
            console.log("user authentication is good, passing through to ", route);
            res.redirect(route);
        });
    });
    console.log("Registering authentication providers -> finished");
};