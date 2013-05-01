var config = require('../lib/config.js'),
    addressable = require('addressable');

function couch(uri) {
    return {
        user: uri.username,
        passwd: uri.password,
        scheme: uri.scheme,
        host: uri.host,
        port: uri.port,
        db: uri.pathname.substring(1)
    };
}

function auth(data) {
    var cdb = data.nano();

    cdb.auth(data.couch.user, data.couch.passwd, function(err, ret, headers) {
        if (config.auth(data, headers)) {
            config.save(data, function() {
                console.log('Configuration updated');
            });
        } else if (err) {
            if ('unauthorized' === err.error) {
                console.error(err.reason);
            } else {
                console.error(err);
            }
        } else {
            console.error('Unexpected auth result!');
            console.error('  >> err:', err);
            console.error('  >> resp:', resp);
            console.error('  >> headers:', headers);
        }
    });
}

module.exports = function(args, opts, data) {
    if (0 === args.length) {
        if ('object' === typeof(data.auth)) {
            data.auth.cookie = null;
        } else {
            data.auth = {cookie: null};
        }
    } else {
        var uri = args[0];

        if (null === (uri = addressable.parse(uri))) {
            console.error('URI not parsable by `addressable`');
        } else if (!(uri.host)) {
            console.error('url.host not parsed');
        } else if (!(uri.pathname)) {
            console.error('url.pathname (database) not defined');
        } else if ('http' !== uri.scheme && 'https' !== uri.scheme) {
            console.error(uri.scheme, 'not support. Scheme must be http or https');
        } else {
            data.couch = couch(uri);
            data.auth.cookie = null;
        }
    }

    if ('object' === typeof(data.couch)) {
        auth(data);
    }
};
