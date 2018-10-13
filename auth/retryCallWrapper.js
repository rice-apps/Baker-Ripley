"use strict";
const passport = require('passport');
const disyuntor = require('disyuntor');

module.exports = function (provider, options)
{
    return disyuntor(passport.authenticate(provider, options), {
        //Timeout for the protected function.
        timeout: '2s',

        //The number of consecutive failures before switching to open mode
        //and stop calling the underlying service.
        maxFailures: 5,

        //The minimum time the circuit remains open before doing another attempt.
        cooldown: '15s',

        //The maximum amount of time the circuit remains open before doing a new attempt.
        maxCooldown: '60s',

        //This is used in error messages.
        name: 'passport.' + provider + '.authenticate'//,

        //optionally log errors
        //monitor: (details) => console.log({err: details.err, args: details.args}, 'Error on authenticate')
    });
};