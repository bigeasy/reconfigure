require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var Coordinator = require('../../reconfigure/coordinator')
    var Consensus = require('../../reconfigure/consensus')
    var con = {
        listeners: [],
        initialize: function (callback) {
            callback(null)
        },
        addListener: function (url, callback) {
            callback(null, {
                node: {
                    value: url
                }
            })
        },

        removeListener: function (url, callback) {
            callback(null, this.listeners.indexOf(url) == -1)
        },
    }
    var coordinator = new Coordinator(con)
    async(function () {
        con.initialize(async())
    }, function () {
        coordinator.listen('127.0.0.1:8081', async())
    }, function (listening) {
        assert(listening, true, 'listen on 8081')
    }, function () {
        coordinator.listen('127.0.0.1:8081', async())
    }, function (listening) {
        assert(listening, false, 'no dupes')
    }, function () {
        coordinator.unlisten('127.0.0.1:8081', async())
    }, function (unlisten) {
        assert(unlisten, true, 'unlisten on 8081')
    })
}
