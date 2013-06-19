var countdown = require('countdown'),
    wrap = require('wordwrap')(72, {mode:'hard'}),
    os = require('os'),
    _ = require('underscore');

module.exports.table = function() {
    return {
        head: ['Tag', 'Desc', 'Hours']
    };
};

module.exports.map = function(doc, emit) {
    var ret, beg, end;

    beg = parseInt(doc._id, 10);
    end = (doc.end || new Date().getTime());

    ret = {
        tag: doc.tag || '',
        msg: doc.msg,
        dur: (end - beg)
    };

    emit(doc.tag, ret);
};

module.exports.reduce = function(key, values, idx) {
    var o = {tag:key, msg:'', dur: 0};

    // sum duration
    values.forEach(function(row) {
        o.dur += row.dur;
    });

    // remove all duplicates
    values = _.uniq(values, function(row) {
        return (row.tag || '') + (row.msg || '');
    });

    // combine messages
    o.msg = values.map(function(row) {
        return row.msg;
    }).join(os.EOL + os.EOL);

    return [o];
};

module.exports.finalize = function(key, values, i) {
    return values.map(function(doc) {
        return {
            'Tag': doc.tag,
            'Desc': wrap(doc.msg),
            'Hours': (((doc.dur / 1000) / 60) / 60).toFixed(2).toString()
        };
    });
};
