require('proof')(2, require('cadence')(prove))
function prove (async, assert) {
    var wrapper = require('../../reconfigure/wrapper')
    var exec = require('child_process').exec
    var ip = /^[^\d]+([\d.]+)/.exec(process.env.DOCKER_HOST)[1]
    var wrap = new wrapper(ip, '2379')
    async([function () {
        async(function () {
            exec('docker kill reconfigure-etcd', async())
        }, function () {
            exec('docker rm reconfigure-etcd', async())
        })
    }], function () {
        exec('docker run -d -p 4001:4001 -p 2380:2380 -p 2379:2379 \
             --name reconfigure-etcd quay.io/coreos/etcd \
             -name reconfigure-etcd \
             -advertise-client-urls http://' + ip + ':2379,http://' + ip + ':4001 \
             -listen-client-urls http://0.0.0.0:2379,http://0.0.0.0:4001 \
             -initial-advertise-peer-urls http://' + ip + ':2380 \
             -listen-peer-urls http://0.0.0.0:2380 \
             -initial-cluster-token etcd-cluster-1 \
             -initial-cluster reconfigure-etcd=http://' + ip + ':2380 \
             -initial-cluster-state new', async())
    }, function (container) {
        wrap.initialize(async())
    }, function () {
        wrap.mkdir('/test', async())
    }, function () {
        wrap.set('/test/blegh', 'haha', async())
    }, function (set) {
        assert(set.node.key, '/reconfigure/test/blegh', 'key set')
        wrap.get('/test/blegh', async())
    }, function (key) {
        assert(key.node.value, 'haha', 'retrieved monitored value')
    })
}
