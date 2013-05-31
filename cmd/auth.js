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

function auth(cfg) {
    var cdb = cfg.nano();

    cdb.auth(cfg.couch.user, cfg.couch.passwd, function(err, ret, headers) {
        if (config.auth(cfg, headers)) {
            config.save(cfg, function() {
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

module.exports = function(args, opts, cfg) {
    if (0 === args.length) {
        if ('object' === typeof(cfg.auth)) {
            cfg.auth.cookie = null;
        } else {
            cfg.auth = {cookie: null};
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
            cfg.couch = couch(uri);
            cfg.auth.cookie = null;
        }
    }

    if ('object' === typeof(cfg.couch)) {
        auth(cfg);
    }
};
