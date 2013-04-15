#!/usr/bin/env node

;(function() {
    var cmd, opts, path;

    cli = require('cli');
    path = require('path');

    cli.enable('status', 'version');
    cli.setApp(path.join(__dirname, '..', 'package.json'));
    cli.parse({
        tag: ['t', 'Tag / Product', 'string']
    }, [
        'auth',
        'begin',
        'clear',
        'end',
        'tag'
    ]);

    cli.main(function(args, opts) {
        switch (cli.command) {
            case 'auth':
                require('../cmd/auth.js')(args, opts);
                break;

            case 'begin':
                require('../cmd/begin.js')(args, opts);
                break;

            case 'clear':
                require('../cmd/clear.js')(args, opts);
                break;

            case 'end':
                require('../cmd/end.js')(args, opts);
                break;

            case 'tag':
                require('../cmd/tag.js')(args, opts);
                break;

        }
    });
})();
