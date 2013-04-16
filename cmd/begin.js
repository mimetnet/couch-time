var vim = require('../lib/vim.js'),
    config = require('../lib/config.js'),
    insert = require('../lib/insert.js');

function begin(cfg, date, row) {
    insert(cfg.nano(), row, function(error, ret) {
        if (error) {
            console.error('Failed to save new record:', error);
        } else {
            cfg.last = ret;
        }

        // save either way b/c cfg
        // last will either be new record or
        // updated _rev on old record.
        config.save(cfg, function() {
            console.log('Begin @', date);
        });
    });
}

function save(opts, msg) {
    config.load(function(cfg) {
        var date = new Date(), row = {
            _id: date.getTime().toString(),
            msg: msg,
            end: null,
            tag: (opts.tag || ((cfg.last && cfg.last.tag)? cfg.last.tag : null))
        };

        // last `begin` hasn't been stopped
        if ('object' === typeof(cfg.last) && 'number' !== typeof(cfg.last.end)) {
            cfg.last.end = date.getTime();

            insert(cfg.nano(), cfg.last, function(error, last) {
                if (error) {
                    console.error('Failed to save end date on last record:', error);
                } else {
                    cfg.last = last;

                    begin(cfg, date, row);
                }
            });
        } else {
            begin(cfg, date, row);
        }
    });
}

module.exports = function(args, opts) {
    if (0 === args.length) {
        vim(function(error, data) {
            if (error) {
                console.error(error);
            } else if ('string' === typeof(data)) {
                save(opts, data);
            }
        });
    } else {
        save(opts, args.join(' '));
    }
};
