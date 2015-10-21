require('proof')(2, require('cadence')(prove))

function prove (async, assert) {
    var wrapper = require('../../reconfigure/wrapper')
    var wrap = new wrapper('127.0.0.1', '4001')
    async(function () {
        wrap.set('/keys/blah', 'haha', async())
    }, function (set) {
        assert(set.node.key, '/keys/blah', 'key set')
        wrap.get('/keys/blah', async())
    }, function (key) {
        assert(key.node.value, 'haha', 'retrieved monitored value')
    })
}
