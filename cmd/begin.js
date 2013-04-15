var config = require('../lib/config.js');

module.exports = function(args, opts) {
    if (0 === args.length)
        return;

    config.load(function(cfg) {
        var date = new Date(), row = {
            _id: date.getTime().toString(),
            msg: args.join(' '),
            end: null,
            tag: (opts.tag || cfg.last.tag || null)
        };

        cfg.nano().insert(row, function(err, ret, headers) {
            if (err) {
                console.error(err);
            } else if (true === ret.ok) {
                row._rev = ret.rev;
                cfg.last = row;

                config.save(cfg, function() {
                    console.log('Begin @', date);
                });
            }
        });
    });
};
