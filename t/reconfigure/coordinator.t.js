require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var Coordinator = require('../../reconfigure/coordinator')
    var coordinator = new Coordinator()
    async(function () {
        assert(coordinator.listen('127.0.0.1:8081'), true, 'listen on 8081')
    }, function () {
        coordinator.listen('127.0.0.1:8082')
        assert(coordinator.listen('127.0.0.1:8082'), false, 'no dupes')
    }, function () {
        assert(coordinator.unlisten('127.0.0.1:8081'), true, 'unlisten on 8081')
    })
}
