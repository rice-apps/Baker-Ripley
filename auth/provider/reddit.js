"use strict";
const c = require('./../../config.js');
const postLoginProcessor = require('./../postLoginProcessor.js');
const generator = require('./../../util/profileUtil.js');

const providerName = 'reddit';
const tokenRoute = '/auth/' + providerName;
const callbackRoute = '/auth/' + providerName + '/callback';
const Strategy = require('passport-reddit').Strategy;
const strategyOptions = {
    clientID: c.REDDIT_CLIENT_ID,
    clientSecret: c.REDDIT_CLIENT_SECRET,
    callbackURL: c.REDDIT_CALLBACK_URL
};
const tokenOptions = {scope: 'identity', state: 'reddit'};
const converter = function (profile)
{
    var email = "";
    if (profile && profile.emails && profile.emails.length)
    {
        for (var i = 0; i < profile.emails.length; i++)
        {
            var profileEmail = profile.emails[i];

            if (profileEmail.type == "account")
            {
                email = profileEmail.value;
                break;
            }
        }
    }
    var first = profile.name.givenName;
    var last = profile.name.familyName;
    var participant = generator.create(profile.provider, profile.id, email, first, "", last);
    participant.provider = profile.provider;
    return participant;
};
var loginHandler = postLoginProcessor(converter);
var strategy = new Strategy(strategyOptions, loginHandler);

module.exports = {
    name: providerName,
    strategy: strategy,
    tokenRoute: tokenRoute,
    tokenOptions: tokenOptions,
    callbackRoute: callbackRoute,
    converter: converter
};