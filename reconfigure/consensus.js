var Etcd = require('node-etcd')
var cadence = require('cadence')
var Delta = require('delta')
var turnstile = require('turnstile')
var abend = require('abend')

function Consensus (host, port, listener) {
    this._etcd = new Etcd(host, port)
    this._watcher = null
    this._listener = listener // <- asynchronous function, if we get an error we panic.
    this._turnstile = new turnstile.Turnstile
}

Consensus.prototype.stop = function () {
    if (this._watcher != null) {
        return this._watcher.stop()
    }
}

Consensus.prototype.initialize = cadence(function (async) {
    async([function () {
        this._etcd.mkdir('/reconfigure', async())
    }, /^Not a file$/, function (error) {
        //already initialized
    }])
})

Consensus.prototype.set = cadence(function (async, key, val) {
// flat hierarchy so `val` should always be
    this._etcd.set('/reconfigure/' + key, val, async())
})

Consensus.prototype.list = cadence(function (async) {
    var list = {}
    async(function () {
        this._etcd.get('/reconfigure', async())
    }, function (props) {
        for (var b in props.node.nodes) {
            list[props.node.nodes[b].key.replace('/reconfigure/', '')] = props.node.nodes[b].value
        }
        return list
    })
})

Consensus.prototype._changed = turnstile.throttle(cadence(function (async) {
    async(function () {
        this.list('/reconfigure', async()) // <- error -> panic!
            // ^^^ bulky, but necessary because race conditions.
    }, function (object) {
        (this._listener)(object, async()) // <- error -> panic!
        // todo: what if there's a synchronous error? Are we going to stack them
        // up in the next tick queue?
        // ^^^ should, we don't know how, use Cadence exceptions to do the right
        // thing.
    })
}))

Consensus.prototype.watch = cadence(function (async) {
    this._watcher = this._etcd.watcher('/reconfigure', null, { recursive: true })
    new Delta(async()).ee(this._watcher).on('change', function (whatIsThis) {
        // ^^^ change
        this._changed(abend)
    }.bind(this)).on('stop')
})

function main () {
    consesus.watch(abend)
}

module.exports = Consensus
