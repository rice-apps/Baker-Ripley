"use strict";

// find profile for user logging in 
module.exports = function (provider, id, email)
{
    var providerIdClause = {};
    providerIdClause["providers." + provider] = id;
    var emailClause = {};
    emailClause["email"] = email;
    var query = {$or: [providerIdClause, emailClause]};

    return query;
}