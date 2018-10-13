"use strict";
const config = require('../config.js');
const entitlements = require('../util/entitlements.js');
const manager = require('./../store/manager.js');
const lookupUser = require('./lookupUser.js');
const parsePermissions = require('./parsePermissions.js');

var store = function ()
{
    return manager.stores.participants;
};

module.exports = function (converter)
{
    var convert = converter;
    var processor = function (accessToken, refreshToken, profile, done)
    {
        process.nextTick(function ()
        {
            console.log(profile);
            var participant = convert(profile);

            var query = lookupUser(profile.provider, profile.id, participant.email);

            var lookup = store().findOne(query).exec();

            lookup.then((user) =>
            {
                // if the user doesnt exist currently, try to make them a profile or ERROR
                if (!user)
                {
                    console.log("user % not found, creating...", participant.username);
                    participant.role = config.AUTH_DEFAULT_ROLE;
                    var save = store().create(participant);
                    save.then((createdUser) =>
                    {
                        createdUser.role = (createdUser.role) ? createdUser.role : entitlements.defaultRole();
                        parsePermissions(createdUser);
                        return done(null, createdUser);
                    }).catch((err) =>
                    {
                        console.log("could not save user, encountered error:", err);
                        //return done(err);
                    });
                }
                else
                {
                    user.role = (user.role) ? user.role : entitlements.defaultRole();
                    parsePermissions(user);
                    console.log("user found: %s", user);
                    return done(null, user);
                }
            }).catch((err) =>
            {
                console.log("error:%s", err);
                console.log("cannot lookup user for profile", profile);
                //return done(err);
            });
        });
    };
    return processor;
};