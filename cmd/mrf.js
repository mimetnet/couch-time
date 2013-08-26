var config = require('../lib/config.js'),
    moment = require('moment'),
    Table = require('cli-table');

function emit(id, val) {
    if (false === Array.isArray(this.acc[id]))
        this.acc[id] = [];

    this.acc[id].push(val);
}

function flatten(table, obj) {
    var a = [];

    Object.keys(obj).forEach(function(r) {
        a = a.concat(obj[r]);
    });

    if (Array.isArray(table.head) && 0 < table.head.length) {
        a = a.map(function(row) {
            var r = [];

            table.head.forEach(function(col) {
                r.push(row[col] || '');
            });

            return r;
        });
    }

    return a;
}

function step(acc, convert) {
    var i = 0;

    Object.keys(acc).forEach(function(k) {
        acc[k] = convert(k, acc[k], i++);
    });

    return acc;
}

function pipeline(map, reduce, finalize, table, rows, cfg) {
    var acc = {}, done = emit.bind({acc:acc});

    rows.forEach(function(row, idx) {
        if (row.doc._id === cfg.last._id)
            row.doc = cfg.last;

        map(row.doc, done, idx);
    });

    // if user set reduce call it, otherwise
    // assume user wants all values in
    // all keys
    if ('function' === typeof(reduce)) {
        step(acc, reduce);
    }

    // allow module to convert 1 last time
    if ('function' === typeof(finalize)) {
        step(acc, finalize);
    }

    // convert array of objects into array of arrays
    // because that is what cli-table expects.
    return flatten(table, acc);
}

function output(cfg, rows) {
    var tab = new Table(cfg);

    rows.forEach(function(row) {
        tab.push(row);
    });

    console.log(tab.toString());
}

function mrf(args, opts, cfg) {
    var query, date = new Date();

    query = {
        descending: false,
        include_docs: true,
        startkey: moment(date).startOf('day').valueOf().toString(),
        endkey: moment(date).endOf('day').valueOf().toString()
    };

    config.store(cfg).list(query, function(err, ret, headers) {
        if (err) {
            if ('unauthorized' === err.error) {
                config.store(cfg).auth(cfg.couch.user, cfg.couch.passwd, function(err, ret, headers) {
                    if (config.auth(cfg, headers)) {
                        config.save(cfg, function() {
                            mrf(args, opts, cfg);
                        });
                    } else {
                        console.error(err);
                    }
                });
            } else {
                console.error(err);
            }
        } else {
            var mod, map, red, fin, tab, res;

            mod = require(args[0]);
            map = mod.map.bind({});
            tab = mod.table();

            if ('function' === typeof(mod.reduce))
                red = mod.reduce.bind({});

            if ('function' === typeof(mod.finalize))
                fin = mod.finalize.bind({});

            // map, reduce, finalize
            res = pipeline(map, red, fin, tab, ret.rows, cfg);

            // create cli-table
            output(tab, res);

            if (config.auth(cfg, headers)) {
                config.save(cfg);
            }
        }
    });
}

module.exports = mrf;
