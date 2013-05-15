var vim = require('../lib/vim.js'),
    config = require('../lib/config.js');

    module.exports = function(args, opts, cfg) {
        if (!cfg.last) {
            console.log('You have nothing to end.... have you begun something?');
            return;
        }

        vim(cfg.last.msg, function(error, data, done) {
            if (error) {
                console.error(error);
            } else if ('string' === typeof(data)) {
                cfg.last.msg = data;

                if ('string' === typeof(opts.tag) && 0 < opts.tag.length)
                    cfg.last.tag = opts.tag;

                config.save(cfg, function() {
                    console.log('Updated @', (new Date()));

                    if ('function' === typeof(done)) {
                        done();
                    }
                });
            }
        });
    };
