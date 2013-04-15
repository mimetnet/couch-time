var config = require('../lib/config.js');

module.exports = function(args, opts) {
    var date = new Date();

    config.load(function(cfg) {
        if (cfg.last) {
            cfg.last.end = date.getTime();

            cfg.nano().insert(cfg.last, function(err, ret, headers) {
                if (err) {
                    switch (err.status_code) {
                        case 409:
                            console.error('Error:', err.reason, 'Is last._rev up-to-date with CouchDB?');
                            break;

                        default:
                            console.error(err);
                            break;
                    }
                } else if (true === ret.ok) {
                    cfg.last._rev = ret.rev;

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
