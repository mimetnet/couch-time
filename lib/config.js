var fs = require('fs'),
    ini = require('ini'),
    path = require('path'),
    nano = require('nano'),
    util = require('util'),
    concat = require('concat-stream'),
    Cookie = require('cookie-jar'),
    CONFIG_FILE = path.join(process.env.HOME, '.couch-time.rc'),
    DEFAULT_TIMEOUT = (1000 * 5);

function wrap(d) {
    d.nano = function(rd) {
        var c = null, u = null;

        rd = util._extend({timeout: DEFAULT_TIMEOUT}, rd || {});

        if (d.couch)
            u = d.couch.scheme + '://' + d.couch.host + ':' + d.couch.port + '/' + d.couch.db;

        if (d.auth && d.auth.cookie)
            c = 'AuthSession=' + d.auth.cookie;

        if ('object' === typeof(d.request_defaults)) {
            rd = util._extend(rd, d.request_defaults);

            if ('string' === typeof(d.request_defaults.timeout))
                rd.timeout = parseInt(d.request_defaults.timeout, 10);
        }

        return nano({url: u, cookie: c, request_defaults: rd});
    };

    if ('object' === typeof(d.last) && 'string' === typeof(d.last.end)) {
        d.last.end = parseInt(d.last.end, 10);
    }

    return d;
}

module.exports.load = function(done) {
    var read = fs.createReadStream(CONFIG_FILE, {encoding:'utf-8'});

    read.pipe(concat(function(err, data) {
        if (err) {
            done(err);
        } else {
            try {
                done(wrap(ini.decode(data)));
            } catch (e) {
                console.error(e);
                done({});
            }
        }
    }));
};

module.exports.save = function(cfg, done) {
    var out = fs.createWriteStream(CONFIG_FILE, {encoding:'utf-8'});

    if ('function' === typeof(done))
        out.on('finish', done);

    delete cfg.nano;
    delete cfg.headers;

    out.end(ini.encode(cfg));
};

module.exports.auth = function(cfg, h) {
    var c;

    if (!h || !Array.isArray(h['set-cookie']) || 0 === h['set-cookie'].length)
        return false;

    c = new Cookie(h['set-cookie'][0]);

    if ('AuthSession' !== c.name || 0 === c.value.length)
        return false;

    cfg.auth.cookie = c.value;

    return true;
};
