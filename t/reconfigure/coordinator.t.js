require('proof')(6, require('cadence')(prove))

function prove (async, assert) {
    var Coordinator = require('../../reconfigure/coordinator')
    var con = {
        added: false,
        listeners: false,
        initialize: function (callback) {
            callback(null)
        },
        addListener: function (url, callback) {
            if (this.added) {
                callback(null, false)
            } else {
                this.added = true
                callback(null, {
                    node: {
                        value: url
                    }
                })
            }
        },
        removeListener: function (url, callback) {
            callback(null, true)
        },
        listeners: function (callback) {
            callback(null, [['127.0.0.1:8081']])
        },
        list: function (callback) {
            callback(null, { key: 'a val', anotherkey: 'a val' })
        }
    }

    var ua = {
        added: false,
        update: function (url, properties, callback) {
            if (!this.added) {
                callback(null, false)
                this.added = true
            } else { callback(null, true) }
        }
    }

    var coordinator = new Coordinator(con, ua)

    async(function () {
        con.initialize(async())
    }, function () {
        coordinator.listen('127.0.0.1:8081', async())
    }, function (listening) {
        assert(listening, true, 'listen on 8081')
    }, function () {
        coordinator.listen('127.0.0.1:8081', async())
    }, function (extant) {
        assert(extant, true, 'no dupes')
        coordinator.retry(async()) //empty run for coverage
    }, function () {
        coordinator.update(async()) // fail so we can retry
    }, function () {
        assert(coordinator._failed, { '127.0.0.1:8081': true }, 'waiting to retry')
        coordinator.update(async()) // test update
    }, function (updated) {
        assert(updated, true, 'updated')
        coordinator.retry(async()) // test retry
    }, function () {
        assert(coordinator._failed, {}, 'retried')
        coordinator.unlisten('127.0.0.1:8081', async())
    }, function (unlisten) {
        assert(unlisten, true, 'unlisten on 8081')
    })
}
