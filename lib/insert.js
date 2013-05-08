module.exports = function(nano, row, done) {
    nano.insert(row, function(err, ret, headers) {
        if (err) {
            done(err);
        } else if (true === ret.ok) {
            row._rev = ret.rev;

            done(null, row, headers);
        } else {
            done(new Error('Unexpected response to insert'));
        }
    });
};


