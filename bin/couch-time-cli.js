#!/usr/bin/env node

var fs = require('fs'),
    cli = require('cli'),
    path = require('path'),
    config = require(path.join(__dirname, '..', 'lib', 'config.js'));

config.load(function(cfg) {
    var cmds = [
        'auth',
        'begin',
        'clear',
        'end',
        'update',
        'tag',
        'today',
        'replicate'
    ];

    cli.enable('status', 'version');
    cli.setApp(path.join(__dirname, '..', 'package.json'));
    cli.parse({
        tag: ['t', 'Tag / Product', 'string'],
        when: ['w', 'When did this event occur (-15m)', 'string']
    }, cmds);

    cli.main(function(args, opts) {
        var filename = path.join(__dirname, '..', 'cmd', cli.command + '.js');

        fs.exists(filename, function(exists) {
            if (exists) {
                require(filename)(args, opts, cfg);
            } else {
                console.error('Command not found:', filename);
                process.exit(1);
            }
        });
    });
});
