"use strict";
const entitlements = require('../util/entitlements');
const authVerify = require('./verifyIsAuthenticated.js');

module.exports = function (requiredActions)
{
    return [
        authVerify, function (req, res, next)
        {
            var required = requiredActions;
            var userActions = req.user.actions;

            if (entitlements.isPermittedAny(userActions, required))
            {
                console.log("It's an old code, but it checks out...");
                next();
            }
            else
            {
                console.log("You shall not pass!");
                res.redirect('/login');
            }
        }
    ];
};