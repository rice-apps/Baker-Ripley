"use strict";
const c = require('./../../config.js');
const postLoginProcessor = require('./../postLoginProcessor.js');
const generator = require('./../../util/profileUtil.js');

const providerName = 'twitter';
const tokenRoute = '/auth/' + providerName;
const callbackRoute = '/auth/' + providerName + '/callback';
const Strategy = require('passport-twitter');
const strategyOptions = {
    consumerKey: c.TWITTER_CLIENT_KEY,
    consumerSecret: c.TWITTER_CLIENT_SECRET,
    callbackURL: c.TWITTER_CALLBACK_URL
};
const tokenOptions = {scope: ['request']};
const converter = function (profile)
{
    // checks if profile is legit and email is existant
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

    var namesArray = profile.displayName.split(' ');
    if (namesArray.length > 1)
    {
        var first = namesArray[0]
        var last = namesArray[namesArray.length - 1]
    }
    else
    {
        var first = profile.displayName
        var last = profile.displayName
    }
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