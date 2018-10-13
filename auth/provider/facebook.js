"use strict";
const c = require('./../../config.js');
const postLoginProcessor = require('./../postLoginProcessor.js');
const generator = require('./../../util/profileUtil.js');

const providerName = 'facebook';
const tokenRoute = '/auth/' + providerName;
const callbackRoute = '/auth/' + providerName + '/callback';
const Strategy = require('passport-facebook').Strategy;
const strategyOptions = {
    clientID: c.FACEBOOK_CLIENT_ID,
    clientSecret: c.FACEBOOK_CLIENT_SECRET,
    callbackURL: c.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'locale', 'birthday']
};
const tokenOptions = {scope: ['email', 'public_profile']};
const converter = function (profile)
{
    var email = "";
    var lang = "Unknown";
    if (profile.email)
    {
        if (Array.isArray(profile.email) && profile.email.length > 0)
        {
            email = profile.email[0];
        }
        else
        {
            email = profile.email;
        }
    }
    if (profile._json.locale)
    {
        lang = profile._json.locale.substr(0, 2);
    }
    var first = profile.name.givenName;
    var last = profile.name.familyName;
    var participant = generator.create(profile.provider, profile.id, email, first, "", last, null, lang);
    participant.provider = profile.provider;
    return participant;
};
var loginHandler = postLoginProcessor(converter);
var strategy = new Strategy(strategyOptions, loginHandler);

module.exports = {
    name: providerName,
    strategy: strategy,
    tokenRoute: tokenRoute,
    tokenOption: tokenOptions,
    callbackRoute: callbackRoute,
    converter: converter
};