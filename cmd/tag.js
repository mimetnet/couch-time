var config = require('../lib/config.js');

module.exports = function(args, opts) {
    var tag;

    if (1 !== args.length) {
        console.error('Tags can only be one word/string');
        return;
    } else {
        tag = args[0];
    }

    config.load(function(cfg) {
        if (cfg.last) {
            cfg.last.tag = tag;
        } else {
            cfg.last = {tag: tag};
        }

        config.save(cfg, function() {
            console.log('Tag:', tag);
        });
    });
};
