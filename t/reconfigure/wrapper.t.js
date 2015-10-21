require('proof')(2, require('cadence')(prove))

function prove (async, assert) {
    var wrapper = require('../../reconfigure/wrapper')
    var uuid = require('node-uuid')
    var wrap = new wrapper('127.0.0.1', '4001')
    var path = uuid.v4()
    async(function () {
        wrap.initialize(async())
        // this creates a `reconfigure` directory which will cause
        //a 'Not a file' error from `etcd` next time this is run.
    }, function () {
        wrap.mkdir(path, async())
    }, function () {
        wrap.set('/' + path + '/blegh', 'haha', async())
    }, function (set) {
        assert(set.node.key, '/reconfigure/' + path + '/blegh', 'key set')
        wrap.get('/' + path + '/blegh', async())
    }, function (key) {
        assert(key.node.value, 'haha', 'retrieved monitored value')
    })
}
