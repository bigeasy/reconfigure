var Etcd = require('node-etcd')
var cadence = require('cadence')

function Consensus (host, port) {
    this._etcd = new Etcd(host, port)
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

Consensus.prototype.get = cadence(function (async, key) {
// key will probably just be '/'
  this._etcd.get('/reconfigure/' + key, async())
})

Consensus.prototype.watch = cadence(function (async, key) {
    this._etcd.watch('/reconfigure/' + key, async())
})

module.exports = Consensus
