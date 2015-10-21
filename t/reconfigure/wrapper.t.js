var exec = require('child_process').exec
exec('docker run -p 127.0.0.1:7001:4001 -p 127.0.0.1:2379:2379 --rm quay.io/coreos/etcd:v2.2.0 --name reconfigure-etcd -name reconfigure-etcd',
function () {
    require('proof')(2, require('cadence')(prove))
    function prove (async, assert) {
        var wrapper = require('../../reconfigure/wrapper')
        var wrap = new wrapper('127.0.0.1', '2379')
        async(function () {
            wrap.initialize(async())
            // this creates a `reconfigure` directory which will cause
            //a 'Not a file' error from `etcd` next time this is run.
        }, function () {
            console.log(arguments)
            wrap.mkdir('/test', async())
        }, function () {
            wrap.set('/test/blegh', 'haha', async())
        }, function (set) {
            assert(set.node.key, '/reconfigure/test/blegh', 'key set')
            wrap.get('/test/blegh', async())
        }, function (key) {
            assert(key.node.value, 'haha', 'retrieved monitored value')
            exec('docker kill reconfigure-etcd',
            function () {console.log(arguments)})
            exec('docker rm reconfigure-etcd',
            function () {console.log(arguments)})
        })
    }
})
