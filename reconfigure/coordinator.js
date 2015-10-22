function Coordinator () {
    this._listeners = []
}

Coordinator.prototype.listen = function (url) {
    if (this._listeners.indexOf(url) < 0) {
        this._listeners.push(url)
        return true
    }
    return false
}

Coordinator.prototype.unlisten = function (url) {
    var len = this._listeners.length
    this._listeners = this._listeners.filter(function (el) {
        return (url !== el)
    })

    return !(len == this._listeners.length)
}

/* Coordinator.prototype.set = cadence(function (async) {
})

Coordinator.prototype.list = cadence(function (async) {
}) */

module.exports = Coordinator
