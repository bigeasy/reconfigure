function Consensus () {
    this._listeners = []
}

Consensus.prototype.listen = function (url) {
    if (this._listeners.indexOf(url) < 0) {
        this._listeners.push(url)
        return true
    }
    return false
}

Consensus.prototype.unlisten = function (url) {
    var len = this._listeners.length
    this._listeners = this._listeners.filter(function (el) {
        return (url !== el)
    })

    return !(len == this._listeners.length)
}

/* Consensus.prototype.set = cadence(function (async) {
})

Consensus.prototype.list = cadence(function (async) {
}) */

module.exports = Consensus
