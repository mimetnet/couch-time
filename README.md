# couch-time

An application for tracking time across numerous (coming soon) terminals. There are many utilies similar to this, but none that worked the way I wanted. Before picking one, I would suggest playing around with most if not all of them.

- [ti](http://ti.sharats.me/)
- [timed](http://adeel.github.io/timed/)
- [timetrap](https://github.com/samg/timetrap)
- [timepouch](https://github.com/chesles/timepouch)

# Usage

This project uses [`cli`](https://github.com/chriso/cli) so all commands (first word following `couch-time`) will be [auto-completed](https://github.com/chriso/cli/blob/master/examples/command.js) like [`npm`](https://github.com/isaacs/npm).

## Install

Not yet added to [`npm`](http://npmjs.org)! But in the meantime you can use `npm`
to insall from GIT or just checkout the code.

## Configuration

Before you can begin tracking time you must setup `couch-time`. This is done by configuring a [`CouchDB`](https://couchdb.apache.org/) database:

    couch-time auth http://[user]:[passwd]@[couchdb.com]/[db_name]

Not all database require authentication, but if they do we use [nano](https://github.com/dscape/nano#using-cookie-authentication)'s auth() method, which supports CouchDB's [cookie authentication](http://guide.couchdb.org/editions/1/en/security.html#cookies).

## Set the current tag/project

    couch-time tag elephants

All projects begun after this command will belong to elephants. This can be overriden by using the `--tag` argument when beginning a project.

## Start Tracking Time

    couch-time begin --tag elephants All words from here on will be the message

    couch-time begin Use previous tag

    couch-time begin All "messages " will be joined together into a single string

    couch-time begin

The last one will launch $EDITOR, enabling full control over the layout.

## Update current work item

    couch-time update

Update the message of your current work item by launching $EDITOR. Any changes you make will be saved locally and published when you `end` this work.

## Stop Tracking Time

    couch-time end

You can do this as many times as you want. It will just continue to push out the end date.

## Destroy your current work 

    couch-time clear

This will erase, delete, clear, pick-your-favorite-word, your current entry. Current is defined by `begin` and not reset on `end` (though the later might change).

# TODO
- [x] `begin` should `end` previous work if we know about it
- [x] allow `end` or create `edit` to update current message
- [ ] handle Iris Couch being "off-line"
- [x] `begin` w/out arguments should launch $EDITOR
- [ ] Reports, reports, and oh yeah, reports

# Credits

- The boss that requires time-sheets
- The projects that almost worked
- The projects that make this possible
	- [addressable](https://github.com/publicclass/addressable)
	- [cli](https://github.com/chriso/cli)
	- [concat-stream](https://github.com/maxogden/node-concat-stream)
	- [cookie-jar](https://github.com/mikeal/cookie-jar)
	- [editor](https://github.com/substack/node-editor)
	- [ini](https://github.com/isaacs/ini)
	- [nano](https://github.com/dscape/nano)
	- [reltime](https://github.com/rsdoiel/reltime)
