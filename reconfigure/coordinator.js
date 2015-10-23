function Coordinator () {
    this._listeners = []
}

Coordinator.prototype.listen = function (url) { // <- listen, POST, -> get them started
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

/*
Consensus.prototype.update = cadence(function (async) {
    async.forEach(function (urls) {
        async(function () {
            // http POST and service is missing
        }, function (body, response) {
            if (!response.okay) {
                setTimeout(function () { }, 60000)
            }
        }, function () {
        })
    })(this._listeners)
})
*/

/* Coordinator.prototype.set = cadence(function (async) {
    function (callback) { self.update(callback) }
})

Coordinator.prototype.list = cadence(function (async) {
}) */

module.exports = Coordinator
