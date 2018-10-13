"use strict";
const config = require('../config.js');
const manager = require('../store/manager.js');
const entitlements = require('../util/entitlements.js');
const parsePermissions = require('./parsePermissions');

var store = function ()
{
    return manager.stores.participants;
}

module.exports = function (req, res, next)
{
    console.log("checking for user session...");
    // if user is authenticated in the session, carry on
    if (req.user)
    {
        console.log("session found.");
        if (!req.user.permissions)
        {
            parsePermissions(req.user);
        }
        next();
    } else if (config.LOCAL_UI_SESSION && config.LOCAL_UI_USER)
    {
        var user = config.LOCAL_UI_USER;
        user = (user instanceof String) ? JSON.parse(user) : user;
        req.session.user = user;
        req.user = user;
        var role = (user.role) ? user.role : entitlements.defaultRole();
        user.actions = entitlements.permittedActions(role);
        parsePermissions(user);
        next();
    }
    // if they aren't redirect them to the login page
    else
    {
        var target = "/login";
        console.log("user is not logged in, redirecting request for " + req.originalUrl + " to " + target);
        if (req.logout)
        {
            req.logout();
        }
        res.redirect(target);
    }
};