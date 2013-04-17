var config = require('../lib/config.js'),
    moment = require('moment'),
    countdown = require('countdown'),
    Table = require('cli-table');

function workTime(list) {
    var f = list[0], l = list[list.length - 1], beg, end, str;

    beg = parseInt(f.doc._id, 10);
    end = l.doc.end || new Date();
    str = countdown(beg, end, countdown.HOURS | countdown.MINUTES).toString();

    return {'Work': str};
}

function totalTime(total) {
    var str = countdown(0, total, countdown.HOURS | countdown.MINUTES).toString();

    return {'Time': str};
}

module.exports = function(args, opts) {
    var query, date = new Date();

    query = {
        descending: false,
        include_docs: true,
        startkey: moment(date).startOf('day').valueOf().toString(),
        endkey: moment(date).endOf('day').valueOf().toString()
    };

    config.load(function(cfg) {
        cfg.nano().list(query, function(err, ret, headers) {
            if (err) {
                console.error(err);
            } else {
                var t = 0, tab;

                tab = new Table({
                    head: ['Tag', 'Desc', 'Duration']
                });

                ret.rows.forEach(function(row) {
                    var s, e, d;

                    s = parseInt(row.doc._id, 10);
                    e = (row.doc.end? parseInt(row.doc.end, 10) : new Date().getTime());
                    d = e - s;
                    t = t + d;

                    tab.push([
                         row.doc.tag || '',
                         row.doc.msg,
                         countdown(s, e, countdown.MINUTES).toString()
                    ]);
                });

                console.log(tab.toString());

                tab = new Table();
                tab.push(totalTime(t));
                tab.push(workTime(ret.rows));
                console.log(tab.toString());
            }
        });
    });
};
