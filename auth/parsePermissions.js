"use strict";
const entitlements = require('../util/entitlements.js');
const entitlementsStore = require('../store/entitlementsStore.js');

module.exports = function (user)
{
    console.log("parsing permissions");
    user.actions = entitlements.permittedActions(user.role);
    var permissions = {};
    var actionKeys = Object.keys(entitlements.actions);
    actionKeys.forEach(action =>
    {
        var label = entitlements.actions[action].value;
        var parts = label.split(".");
        var section = parts[0];
        var subsection = parts[1];
        var permission = parts[2];

        if (!permissions[section])
        {
            permissions[section] = {};
        }

        if (!permissions[section][subsection])
        {
            permissions[section][subsection] = {};
        }

        permissions[section][subsection][permission] = user.actions.indexOf(label) > -1
    });
    console.log("permissions parsed.");
    user.permissions = permissions;
};