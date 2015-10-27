var cadence = require('cadence')

function Coordinator (consensus) {
    this._consensus = consensus
}

Coordinator.prototype.listen = cadence(function (async, url) { // <- listen, POST, -> get them started
    async(function () {
        this._consensus.addListener(url, async())
    }, function (act) {
        if (act) {
            return (act.node.value == url)
        }
        return false
    })
})

Coordinator.prototype.unlisten = cadence(function (async, url) {
    this._consensus.removeListener(url, async())
})

Coordinator.prototype.list = cadence(function (async) {
    this._consensus.list(async())
})

Coordinator.prototype.update = cadence(function (async) {
    async(function () {
        this._consensus.listeners(async())
    }, function (list) {
        async.forEach(function (urls) {
            /*
            async(function () {
                // http POST and service is missing
            }, function (body, response) {
                if (!response.okay) {
                    setTimeout(function () { }, 60000)
                }
            }, function () {
            })
                */
        })(list)
    })
})
/* Coordinator.prototype.set = cadence(function (async) {
    function (callback) { self.update(callback) }
})
*/

module.exports = Coordinator
