var config = require('../lib/config.js'),
    insert = require('../lib/insert.js'),
    reltime = require('reltime');

function end(args, opts, cfg) {
    var date = new Date();

    if (opts.when) {
        date = reltime.parse(date, opts.when);
    }

    if (cfg.last) {
        cfg.last.end = date.getTime();

        insert(config.store(cfg), cfg.last, function(err, ret, headers) {
            if (err) {
                if ('unauthorized' === err.error) {
                    config.store(cfg).auth(cfg.couch.user, cfg.couch.passwd, function(err, ret, headers) {
                        if (config.auth(cfg, headers)) {
                            config.save(cfg, function() {
                                end(args, opts, cfg);
                            });
                        } else {
                            console.error(err);
                        }
                    });
                } else {
                    console.error(err);
                }
            } else {
                cfg.last = ret;

                config.auth(cfg, headers);
                config.save(cfg, function() {
                    console.log('End @', date);
                });
            }
        });
    } else {
        console.log('You have nothing to end.... have you begun something?');
    }
}

module.exports = end;
