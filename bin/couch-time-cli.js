#!/usr/bin/env node

;(function() {
    var cmd, opts, path;

    fs = require('fs');
    cli = require('cli');
    path = require('path');

    cli.enable('status', 'version');
    cli.setApp(path.join(__dirname, '..', 'package.json'));
    cli.parse({
        tag: ['t', 'Tag / Product', 'string'],
        when: ['w', 'When did this event occur (-15m)', 'string']
    }, [
        'auth',
        'begin',
        'clear',
        'end',
        'update',
        'tag',
        'today'
    ]);

    cli.main(function(args, opts) {
        var filename = path.join(__dirname, '..', 'cmd', cli.command + '.js');

        fs.exists(filename, function(exists) {
            if (exists) {
                require(filename)(args, opts);
            } else {
                console.error('Command not found:', filename);
                process.exit(1);
            }
        });
    });
})();
