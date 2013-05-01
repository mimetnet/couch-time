module.exports = function(nano, row, done) {
    nano.insert(row, function(err, ret, headers) {
        if (err) {
            if (400 <= err.status_code || 599 >= err.status_code) {
                done(new Error(err.reason));
            } else {
                done(err);
            }
        } else if (true === ret.ok) {
            row._rev = ret.rev;

            done(null, row, headers);
        } else {
            done(new Error('Unexpected response to insert'));
        }
    });
};


