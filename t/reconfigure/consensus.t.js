require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var Consensus = require('../../reconfigure/consensus')
    var consensus = new Consensus()
    async(function () {
        assert(consensus.listen('127.0.0.1:8081'), true, 'listen on 8081')
    }, function () {
        consensus.listen('127.0.0.1:8082')
        assert(consensus.listen('127.0.0.1:8082'), false, 'no dupes')
    }, function () {
        assert(consensus.unlisten('127.0.0.1:8081'), true, 'unlisten on 8081')
    })
}
