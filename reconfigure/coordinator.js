function Coordinator (consensus) {
    this._listeners = []
    this._consensus = consensus
}

Coordinator.prototype.listen = function (url, callback) { // <- listen, POST, -> get them started
    if (this._listeners.indexOf(url) < 0) {
        this._listeners.push(url)
        this._consensus.addListener(url, function (error, act) {
            if (!act) {
                callback(null, false)
            } else {
                callback(null, act.node.value == url)
            }
        })
    } else {
        callback(null, false)
    }
}

Coordinator.prototype.unlisten = function (url, callback) {
    var len = this._listeners.length
    this._listeners = this._listeners.filter(function (el) {
        return (url !== el)
    })

    if (!(len == this._listeners.length)) {
        this._consensus.removeListener(url, function (error, act) {
            if (!act) {
                callback(null, false)
            } else {
                callback(null, true)
            }
        })
    } else {callback(null, false)}
}

/*
Coordinator.prototype.update = cadence(function (async) {
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
