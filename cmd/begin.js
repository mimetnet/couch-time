var vim = require('../lib/vim.js'),
    config = require('../lib/config.js'),
    insert = require('../lib/insert.js'),
    reltime = require('reltime');

function begin(cfg, date, row, done) {
    insert(config.store(cfg), row, function(err, ret, headers) {
        if (err) {
            if ('unauthorized' === err.error) {
                config.store(cfg).auth(cfg.couch.user, cfg.couch.passwd, function(err, ret, headers) {
                    if (config.auth(cfg, headers)) {
                        config.save(cfg, function() {
                            begin(cfg, date, row, done);
                        });
                    } else {
                        console.error('Failed to save new record:', err);
                    }
                });
            } else {
                console.error('Failed to save new record:', err);
            }

            if ('function' === typeof(done)) {
                done();
            }
        } else {
            cfg.last = ret;

            config.auth(cfg, headers);
            config.save(cfg, function() {
                console.log('Begin @', date);

                if ('function' === typeof(done)) {
                    done();
                }
            });
        }
    });
}

function save(cfg, opts, msg, done) {
    var date = new Date(), row = {
        _id: date.getTime().toString(),
        msg: msg,
        end: null,
        tag: (opts.tag || ((cfg.last && cfg.last.tag)? cfg.last.tag : null))
    };

    if (opts.when) {
        date = reltime.parse(date, opts.when);
        row._id = date.getTime().toString();
    }

    // last `begin` hasn't been stopped
    if ('object' === typeof(cfg.last) && 'number' !== typeof(cfg.last.end)) {
        cfg.last.end = date.getTime();

        insert(config.store(cfg), cfg.last, function(err, last, headers) {
            if (err) {
                if ('unauthorized' === err.error) {
                    config.store(cfg).auth(cfg.couch.user, cfg.couch.passwd, function(err, ret, headers) {
                        if (config.auth(cfg, headers)) {
                            cfg.last.end = null; // reset so we redo entire path
                            config.save(cfg, function() {
                                save(cfg, opts, msg, done);
                            });
                        } else {
                            console.error(err);
                        }
                    });
                } else {
                    console.error('Failed to save end date on last record:', err);
                }
            } else {
                cfg.last = last;

                begin(cfg, date, row, done);
            }
        });
    } else {
        begin(cfg, date, row, done);
    }
}

module.exports = function(args, opts, cfg) {
    if (0 === args.length) {
        vim(function(error, data, done) {
            if (error) {
                console.error(error);
            } else if ('string' === typeof(data)) {
                save(cfg, opts, data, done);
            }
        });
    } else {
        save(cfg, opts, args.join(' '));
    }
};
