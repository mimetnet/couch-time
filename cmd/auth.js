var config = require('../lib/config.js'),
    addressable = require('addressable'),
    Cookie = require('cookie-jar');

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
        if (true === ret.ok) {
            var ck = new Cookie(headers['set-cookie'][0]);

            if ('AuthSession' === ck.name && 0 < ck.value.length) {
                data.auth.cookie = ck.value;
            }

            config.save(data, function() {
                console.log('Configuration updated');
            });
        }
    });
}

module.exports = function(args, opts) {
    config.load(function(data) {
        if (0 === args.length) {
            data.auth.cookie = null;
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
    });
};
