"use strict";
const c = require('./../../config.js');
const postLoginProcessor = require('./../postLoginProcessor.js');
const generator = require('./../../util/profileUtil.js');

const providerName = 'linkedin';
const tokenRoute = '/auth/' + providerName;
const callbackRoute = '/auth/' + providerName + '/callback';
const Strategy = require('passport-linkedin-oauth2').Strategy;
const strategyOptions = {
    clientID: c.LINKEDIN_CLIENT_ID,
    clientSecret: c.LINKEDIN_CLIENT_SECRET,
    callbackURL: c.LINKEDIN_CALLBACK_URL
};
var tokenOptions = {
    scope: ['r_basicprofile', 'r_emailaddress'],
    state: '23a44248-1d7b-4b07-a5e9-d26604282b23',
    response_type: 'code',
    client_id: '78o6m0ibc2b9dw',
    redirect_uri: strategyOptions.callbackURL
};
//var tokenOptions = {scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'};
var converter = function (profile)
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