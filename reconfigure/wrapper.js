var Etcd = require('node-etcd')
var cadence = require('cadence')

function Wrapper (host, port) {
    this._etcd = new Etcd(host, port)
}

Wrapper.prototype.initialize = cadence(function (async) {
    async([function () {
        this._etcd.mkdir('/reconfigure', async())
    }, /^Not a file$/, function (error) {
        //already initialized
    }])
})

Wrapper.prototype.set = cadence(function (async, key, val) {
// flat hierarchy so `val` should always be
    this._etcd.set('/reconfigure/' + key, val, async())
})

Wrapper.prototype.get = cadence(function (async, key) {
// key will probably just be '/'
  this._etcd.get('/reconfigure/' + key, async())
})

Wrapper.prototype.watch = cadence(function (async, key) {
    this._etcd.watch(key, async())
})

module.exports = Wrapper
