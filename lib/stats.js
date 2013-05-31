var countdown = require('countdown');

module.exports.table = function() {
    return {};
};

module.exports.map = function(doc, emit) {
    var val = {
        beg: parseInt(doc._id, 10),
        end: doc.end || new Date().getTime(),
        dur: 0
    };

    val.dur = (val.end - val.beg);

    emit('total', val);
    emit('work', val);
};

module.exports.reduce = function(key, values, idx) {
    var o = {beg: 0, end:0, dur: 0};

    if ('work' === key) {
        o.beg = values[0].beg;
        o.end = values[values.length - 1].end;
    } else {
        values.forEach(function(v) {
            o.dur += v.dur;
        });
    }

    return [o];
};

module.exports.finalize = function(key, values, idx) {
    var o = values[0];

    if ('work' === key) {
        o = {'Work': countdown(o.beg, o.end, countdown.HOURS | countdown.MINUTES).toString()};
    } else {
        o = {'Time': countdown(0, o.dur, countdown.HOURS | countdown.MINUTES).toString()};
    }

    return [o];
};
