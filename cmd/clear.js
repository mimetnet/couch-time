var config = require('../lib/config.js');

module.exports = function(args, opts, cfg) {
    var date = new Date();

    if (cfg.last) {
        var last = cfg.last;

        cfg.nano().destroy(last._id, last._rev, function (err, ret, headers) {
            if (err) {
                if (404 === err.status_code) {
                    console.error('Current record not found:', last.msg);
                } else {
                    console.error('Unknown Error', err);
                }
            } else if (true === ret.ok) {
                delete cfg.last;

                config.save(cfg, function() {
                    console.log('Cleared: ', last.msg);
                });
            }
        });
    } else {
        console.log('You have nothing to clear.... have you begun something?');
    }
};
