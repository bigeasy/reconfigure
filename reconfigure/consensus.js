var Etcd = require('node-etcd')
var cadence = require('cadence')
var Delta = require('delta')
var abend = require('abend')
var Operation = require('operation')
var restrict = require('restrictor')
var turnstile = require('turnstile')

function Consensus (key, host, port, listener) {
    this._etcd = new Etcd(host, port)
    this._watcher = null
    this._directory = '/reconfigure/listeners/' + key
    this._listener = new Operation(listener) // <- asynchronous function, if we get an error we panic.
    this._turnstile = new turnstile.Turnstile
    this._reactor = new Reactor(this._listener)
}

Consensus.prototype.initialize = cadence(function (async) {
    async([function () {
        this._etcd.mkdir('/reconfigure/properties', async())
    }, /^Not a file$/, function (error) {
        //already initialized
    }], [function () {
        this._etcd.mkdir(this._directory, async())
    }, /^Not a file$/, function (error) {
        // ^^^
    }])
})

Consensus.prototype.stop = function () {
    if (this._watcher != null) {
        return this._watcher.stop()
    }
}

Consensus.prototype.addListener = cadence(function (async, url) {
    async(function () {
        this.listeners(async())
    }, function (list) {
        for (var member in list) {
            if (list[member] == url) {
                return false
            }
        }
        return true
    }, function (set) {
        if (set) {
            this._etcd.set(this._directory + '/' + Date.now(), url, async())
        } else {
            return {
                dupe: !set,
                set: false
            }
        }
    }, function (act) {
        // if set, double-check URL
        if (act.node) {
            return [ true, (act.node.value == url) ]
        }

        return [ act.set, act.dupe ]
    })
})


Consensus.prototype.removeListener = cadence(function (async, url) {
    async(function () {
        this._etcd.get(this._directory, async())
    }, function (list) {
        var keys = []
        for (var i in list.node.nodes) {
            if (list.node.nodes[i].value == url) {
                keys.push(list.node.nodes[i].key) // don't break in case of dupes
            }
        }
        return [keys]
    }, function (keys) {
        async.forEach(function (key) {
            this._etcd.del(key, async())
        })(keys)
    })
})

Consensus.prototype.listeners = cadence(function (async) {
    async(function () {
        this._etcd.get(this._directory, async())
    }, function (list) {
        var ret = []
        for (var i in list.node.nodes) {
            ret.push(list.node.nodes[i].value)
        }
        return [ret]
    })

})

Consensus.prototype.set = cadence(function (async, key, val) {
// flat hierarchy so `val` should always be
    this._etcd.set('/reconfigure/properties/' + key, val, async())
})

Consensus.prototype.list = cadence(function (async) {
    var list = {}
    async(function () {
        this._etcd.get('/reconfigure/properties', async())
    }, function (props) {
        for (var b in props.node.nodes) {
            list[props.node.nodes[b].key.replace('/reconfigure/properties/', '')] = props.node.nodes[b].value
        }
        return list
    })
})

Consensus.prototype._changed = restrict(cadence(function (async) {
    this._listener.apply([ async() ]) // <- error -> panic!
        // todo: what if there's a synchronous error? Are we going to stack them
        // up in the next tick queue?
        // ^^^ should, we don't know how, use Cadence exceptions to do the right
        // thing.
}))

Consensus.prototype.watch = cadence(function (async) {
    this._watcher = this._etcd.watcher('/reconfigure/properties', null, { recursive: true })
    new Delta(async()).ee(this._watcher).on('change', function (whatIsThis) {
        // ^^^ change
        this._changed(abend)
    }.bind(this)).on('stop')
})

module.exports = Consensus
