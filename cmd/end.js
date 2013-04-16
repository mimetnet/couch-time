var config = require('../lib/config.js'),
    insert = require('../lib/insert.js');

module.exports = function(args, opts) {
    var date = new Date();

    config.load(function(cfg) {
        if (cfg.last) {
            cfg.last.end = date.getTime();

            insert(cfg.nano(), cfg.last, function(error, ret) {
                if (error) {
                    console.error(error);
                } else {
                    cfg.last = ret;

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
