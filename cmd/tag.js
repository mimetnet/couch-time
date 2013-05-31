var config = require('../lib/config.js');

module.exports = function(args, opts, cfg) {
    var tag;

    if (1 !== args.length) {
        if (cfg.last) {
            console.log('Tag:', cfg.last.tag);
        } else {
            console.log('Tag: undefined');
        }
    } else if (!(tag = args.shift()) || 0 === tag.length) {
        console.error('Cannot assign an empty tag');
    } else {
        if (cfg.last) {
            cfg.last.tag = tag;
        } else {
            cfg.last = {tag: tag};
        }

        config.save(cfg, function() {
            console.log('Tag:', tag);
        });
    }
};
