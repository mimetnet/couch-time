# couch-time

An application for tracking time across numerous (coming soon) terminals. There are many utilies similar to this, but none that worked the way I wanted. Before picking one, I would suggest playing around with most if not all of them.

- [ti](http://ti.sharats.me/)
- [timed](http://adeel.github.io/timed/)
- [timetrap](https://github.com/samg/timetrap)
- [timepouch](https://github.com/chesles/timepouch)

# Usage

This project uses [cli](https://github.com/chriso/cli) so all commands (first word following `couch-time`) will be [auto-completed](https://github.com/chriso/cli/blob/master/examples/command.js) like [npm](https://github.com/isaacs/npm).

## Install

Not yet added to [`npm`](http://npmjs.org)! But in the meantime you can use `npm`
to insall from GIT or just checkout the code.

## Configuration

Before you can begin tracking time you must setup `couch-time`. This is done by configuring a [CouchDB](https://couchdb.apache.org/) database:

``` js
couch-time auth http://[user]:[passwd]@[couchdb.com]/[db_name]
```

## Set the current tag/project

``` js
couch-time tag elephants
```

All projects begun after this command will belong to elephants. This can be overriden by using the `--tag` argument when beginning a project.

## Begin Tracking Time

``` js
couch-time begin --tag elephants All words from here on will be the message
```

## End Tracking Time

``` js
couch-time end
```

You can do this as many times as you want. It will just continue to push out the end date.

## Destroy your current work 

``` js
couch-time clear
```

This will erase, delete, clear, pick-your-favorite-word, your current entry. Current is defined by `begin` and not reset on `end` (though the later might change).

# Credits

- The boss that requires time-sheets
- The projects that almost worked
- The projects that make this possible
	- [addressable](https://github.com/publicclass/addressable)
	- [cli](https://github.com/chriso/cli)
	- [concat-stream](https://github.com/maxogden/node-concat-stream)
	- [cookie-jar](https://github.com/mikeal/cookie-jar)
	- [ini](https://github.com/isaacs/ini)
	- [nano](https://github.com/dscape/nano)
