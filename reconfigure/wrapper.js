var Etcd = require('node-etcd')
var cadence = require('cadence')

function Wrapper (host, port) {
    this._etcd = new Etcd(host, port)
}

Wrapper.prototype.initialize = cadence(function (async) {
    this.mkdir('/reconfigure', async())
})

Wrapper.prototype.set = cadence(function (async, key, val) {
// flat hierarchy so `val` should always be
    this._etcd.set('/reconfigure/' + key, val, async())
})

Wrapper.prototype.get = cadence(function (async, key) {
// key will probably just be '/'
  this._etcd.get('/reconfigure' + key, async())
})

Wrapper.prototype.mkdir = cadence(function (async, dir) {
    this._etcd.mkdir('/reconfigure' + dir, async())
}

/*
Wrapper.prototype.watch = function (key, callback) {
    var watch = this._etcd.watcher(key)
    watch.on('change', callback)
    return watch
}
*/

module.exports = Wrapper
