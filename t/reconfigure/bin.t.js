require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var bin = require('../../reconfigure.bin'), io
    async(function () {
        io = bin({}, [], {}, async())
    }, function () {
        assert(true, 'running')
        io.events.emit('SIGINT')
    })
}
