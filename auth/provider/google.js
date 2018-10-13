"use strict";
const c = require('./../../config.js');
const postLoginProcessor = require('./../postLoginProcessor.js');
const generator = require('./../../util/profileUtil.js');

const providerName = 'google';
const tokenRoute = '/auth/' + providerName;
const callbackRoute = '/auth/' + providerName + '/callback';
const Strategy = require('passport-google-oauth').OAuth2Strategy;
const strategyOptions = {
    clientID: c.GOOGLE_CLIENT_ID,
    clientSecret: c.GOOGLE_CLIENT_SECRET,
    callbackURL: c.GOOGLE_CALLBACK_URL
};
const tokenOptions = {scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'};
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