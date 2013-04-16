var vim = require('../lib/vim.js'),
    config = require('../lib/config.js');

module.exports = function(args, opts) {
    config.load(function(cfg) {
        if (!cfg.last) {
            console.log('You have nothing to end.... have you begun something?');
            return;
        }

        vim(cfg.last.msg, function(error, data, done) {
            if (error) {
                console.error(error);
            } else if ('string' === typeof(data)) {
                cfg.last.msg = data;

                config.save(cfg, function() {
                    console.log('Updated @', (new Date()));

                    if ('function' === typeof(done)) {
                        done();
                    }
                });
            }
        });
    });
};
