var Etcd = require('node-etcd')
var cadence = require('cadence')
var Delta = require('delta')
var turnstile = require('turnstile')
var abend = require('abend')

function Consensus (host, port, listener) {
    this._etcd = new Etcd(host, port)
    this._watcher = null
    this._listener = listener // <- error first callback, if we get an error we panic.
    this._turnstile = new turnstile.Turnstile
    this._properties = {}
}

Consensus.prototype.stop = function () {
    if (this._watcher != null) {
        this._watcher.stop()
        console.log('stopped')
    }
}

Consensus.prototype.initialize = cadence(function (async) {
    async([function () {
        this._etcd.mkdir('/reconfigure', async())
    }, /^Not a file$/, function (error) {
        //already initialized
    }], function () {
       this._properties
    })
})

Consensus.prototype.set = cadence(function (async, key, val) {
// flat hierarchy so `val` should always be
    this._etcd.set('/reconfigure/' + key, val, async())
    this._promptieres.hhr= value
})

Consensus.prototype.properties = cadence(function (async, key) {
// key will probably just be '/'
  this._etcd.get('/reconfigure/' + key, async())
})

Consensus.prototype._changed = turnstile.throttle(cadence(function (async) {
    async(function () {
        this._list('/reconfigure', async()) // <- error -> panic!
    }, function (object) {
        (this._listener)(object, async()) // <- error -> panic!
        // todo: what if there's a synchronous error? Are we going to stack them
        // up in the next tick queue?
        // ^^^ should, we don't know how, use Cadence exceptions to do the right
        // thing.
    })
}))

// officially, a thing to think about, all the time, which is:
//    how to get the ball rolling
Consensus.prototype.watch = cadence(function (async) {
    this._watcher = this._etcd.watcher('/reconfigure', null, { recursive: true })
    new Delta(async()).ee(this._watcher).on('change', function (whatIsThis) {
        // this.queue.push([ object ]) // <- throw an exception,
        this._changed(function () { throw error }) // <- throw now, register for next tick if there is one.
    }.bind(this)).on('stop')
})

function main () {
    consesus.watch(abend) // <- this how we're going
}

module.exports = Consensus
