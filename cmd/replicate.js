var config = require('../lib/config.js');

module.exports = function(args, opts, cfg) {
    var db = cfg.nano({timeout: 100000});

    args.forEach(function(url) {
        db.replicate(url, {create_target:false}, function(err, res, headers) {
            if (err) {
                if ('db_not_found' === err.error) {
                    console.error('Database not found:', err.reason);
                    console.error(' >> Please make sure it exists and that it is secure');
                } else if ('unauthorized' === err.error) {
                    console.error('Please re-authenticate:', err.reason);
                } else {
                    console.error(err);
                }
            } else {
                console.log('Replicated to "' + url + '"');

                if (true === res.no_changes)
                    console.log(' >> No changes');

                if (Array.isArray(res.history)) {
                    res.history.forEach(function(row) {
                        console.log(' >> Read:', row.docs_read);
                        console.log(' >> Written:', row.docs_written);
                        console.log(' >> Failures:', row.doc_write_failures);
                    });
                }
            }

            if (config.auth(cfg, headers)) {
                config.save(cfg);
            }
        });
    });
};
