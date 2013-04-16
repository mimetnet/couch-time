module.exports = function(nano, row, done) {
    nano.insert(row, function(err, ret, headers) {
        if (err) {
            switch (err.status_code) {
                case 409:
                    done(new Error('Error: ' + err.reason));
                    break;

                default:
                    done(err);
                    break;
            }
        } else if (true === ret.ok) {
            row._rev = ret.rev;

            done(null, row);
        } else {
            done(new Error('Unexpected response to insert'));
        }
    });
};


