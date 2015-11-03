require('proof')(5, require('cadence')(prove))

function prove (async, assert) {
    var bin = require('../../reconfigure.bin'), io
    var exec = require('child_process').exec
    var ip
    if (process.env.DOCKER_HOST) {
        ip = /^[^\d]+([\d.]+)/.exec(process.env.DOCKER_HOST)[1]
    } else {
        console.log(require('os').networkInterfaces())
        ip = require('os').networkInterfaces().eth0.filter(function (iface) {
            return iface.family == 'IPv4'
        })[0].address
    }

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
    }, function () {
        io = bin({}, ['serve', '--port=2390', '--etcdaddr=' + ip + ':2379'], {}, async())
    }, function () {
        assert(true, 'running')
        bin({}, ['set', '127.0.0.1:2390', 'greeting',
        'Hello World!'], {}, async())
    }, function () {
        bin({}, ['list', '127.0.0.1:2390'], {}, async())
    }, function (values) {
        assert(values, 'greeting\tHello World!\n', 'key set and retrieved')
        bin({}, ['register', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
        assert(ret.success, true, 'registered')
       bin({}, ['register', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
        assert(ret.extant, true, 'duplicant registry')
        bin({}, ['deregister', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
        assert(ret.success, true, 'deregistered')
        io.events.emit('SIGINT')
    })
}
