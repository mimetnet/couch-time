var config = require('../lib/config.js'),
    moment = require('moment'),
    Table = require('cli-table');

function emit(id, val) {
    if (false === Array.isArray(this.acc[id]))
        this.acc[id] = [];

    this.acc[id].push(val);
}

function flatten(obj) {
    var a = [];

    Object.keys(obj).forEach(function(r) {
        a = a.concat(obj[r]);
    });

    return a;
}

function step(acc, convert) {
    var i = 0;

    Object.keys(acc).forEach(function(k) {
        acc[k] = convert(k, acc[k], i++);
    });

    return acc;
}

function pipeline(map, reduce, finalize, rows) {
    var acc = {}, done = emit.bind({acc:acc});

    rows.forEach(function(row, idx) {
        map(row.doc, done, idx);
    });

    // if user set reduce call it, otherwise
    // ass ume user wants all values in
    // all keys
    if ('function' === typeof(reduce)) {
        step(acc, reduce);
    }

    // allow module to convert each accect 1 last time
    if ('function' === typeof(finalize)) {
        step(acc, finalize);
    }

    // convert array of objects into array of arrays
    // because that is what cli-table expects.
    return flatten(acc);
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
            var mod, map, red, fin, res;

            mod = require(args[0]);
            map = mod.map.bind({});

            if ('function' === typeof(mod.reduce))
                red = mod.reduce.bind({});

            if ('function' === typeof(mod.finalize))
                fin = mod.finalize.bind({});

            // map, reduce, finalize
            res = pipeline(map, red, fin, ret.rows);

            // create cli-table
            output(mod.table(), res);

            if (config.auth(cfg, headers)) {
                config.save(cfg);
            }
        }
    });
}

module.exports = mrf;
