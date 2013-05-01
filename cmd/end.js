var config = require('../lib/config.js'),
    insert = require('../lib/insert.js'),
    reltime = require('reltime');

module.exports = function(args, opts) {
    var date = new Date();

    if (opts.when) {
        date = reltime.parse(date, opts.when);
    }

    config.load(function(cfg) {
        if (cfg.last) {
            cfg.last.end = date.getTime();

            insert(cfg.nano(), cfg.last, function(error, ret, headers) {
                if (error) {
                    console.error(error);
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
    });
};
