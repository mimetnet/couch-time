var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    editor = require('editor'),
    concat = require('concat-stream');

module.exports = function(done) {
    var filename = path.join(os.tmpdir(), 'couch-time-'+(process.env.USER || process.env.USERNAME)+'.txt');

    editor(filename, function(code, sig) {
        var read;

        if (0 === code) {
            read = fs.createReadStream(filename, {encoding:'utf-8'});
            read.on('error', function(error) {
                fs.unlink(filename, function(){});
                done(null, null);
            }).on('close', function() {
            }).pipe(concat(function(error, data) {
                if (error) {
                    done(error);
                } else {
                    data = (data && 0 < data.length && 0 < (data = data.trim()).length)? data : null;

                    // pass callback to handler so they can delete file if and
                    // when needed
                    done(null, data, function() {
                        fs.unlink(filename, function(){});
                    });
                }
            }));
        } else {
            fs.unlink(filename, function(){});
            done(new Error('Code = ' + code));
        }
    });
};
