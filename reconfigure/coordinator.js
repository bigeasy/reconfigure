var cadence = require('cadence')

function Coordinator (consensus, ua) {
    this._consensus = consensus
    this._ua = ua
    this._failed= {}
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
        this.list(async())
    }, function (urls, list) {
        async.forEach(function (url) {
            async(function () {
                this._ua.update(url, list, async())
            }, function (ok) {
                if (!ok) {
                    this._failed[url] = true
                }
            })
        })(urls)
    })
})

Coordinator.prototype.retry = cadence(function (async) {
    if (Object.keys(this._failed).length < 1) return
    async.forEach(function (url) {
        async(function () {
            this.list(async())
        }, function (list) {
            this._ua.update(url, list, async())
        }, function (ok) {
            if (ok) {
                delete this._failed[url]
            }
        })
    })(Object.keys(this._failed))
})

/* Coordinator.prototype.set = cadence(function (async) {
    function (callback) { self.update(callback) }
})
*/

module.exports = Coordinator
