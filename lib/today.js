var countdown = require('countdown'),
    wrap = require('wordwrap')(72, {mode:'hard'});

module.exports.table = function() {
    return {
        head: ['ID', 'Tag', 'Desc', 'Duration']
    };
};

module.exports.map = function(doc, emit) {
    emit(doc._id, doc);
};

module.exports.reduce = undefined;

module.exports.finalize = function(key, values, i) {
    return values.map(function(doc) {
        var s, e, d;

        s = parseInt(doc._id, 10);
        e = (doc.end? parseInt(doc.end, 10) : new Date().getTime());
        d = e - s;

        return [
            (1+i),
            doc.tag || '',
            wrap(doc.msg),
            countdown(s, e, countdown.MINUTES).toString()
        ];
    });
};
