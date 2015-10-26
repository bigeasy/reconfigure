function Coordinator (consensus) {
    this._consensus = consensus
}

Coordinator.prototype.listen = function (url, callback) { // <- listen, POST, -> get them started
    this._consensus.addListener(url, function (error, act) {
        if (!act) {
            callback(null, false)
        } else {
            callback(null, act.node.value == url)
        }
    })
}

Coordinator.prototype.unlisten = function (url, callback) {
    this._consensus.removeListener(url, function (error, act) {
        if (!act) {
            callback(null, false)
        } else {
            callback(null, true)
        }
    })
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
