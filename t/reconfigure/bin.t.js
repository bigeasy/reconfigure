require('proof')(7, require('cadence')(prove))

function prove (async, assert) {
    var cadence = require('cadence')
    var bin = require('../../reconfigure.bin'), io
    var http = require('http')
    var Semblance = require('semblance')
    var semblance = new Semblance
    var server = http.createServer(semblance.dispatch())
    var exec = require('child_process').exec
    var ip
    if (process.env.DOCKER_HOST) {
        ip = /^[^\d]+([\d.]+)/.exec(process.env.DOCKER_HOST)[1]
    } else {
        var interfaces = require('os').networkInterfaces()

        ip = [].concat.apply([],
                Object.keys(interfaces).map(function (key) { return interfaces[key] }))
            .filter(function (iface) {
                return iface.internal ? false : iface.family == 'IPv4'
            })[0].address
    }
    console.log('Using IPv4 address: ', ip)

    var dock = cadence(function (async) {
        async([function () {
            exec('docker kill reconfigure-etcd', async())
        }, /kill/, function (error) {
        }], [function () {
            exec('docker rm reconfigure-etcd', async())
        }, /running/, function (error) {
        }])
    })

    async([function () {
        dock(async())
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
        server.listen(4077, '127.0.0.1', async())
    }, function () {
        io = bin({}, ['serve', '--port=2390', '--etcdaddr=' + ip + ':2379'], {}, async())
    }, function () {
        assert(true, 'running')
        bin({}, ['register', '127.0.0.1:2390', 'http://127.0.0.1:4077'], {}, async())
    }, function (ret) {
        assert(ret.success, true, 'registered')
        bin({}, ['set', '127.0.0.1:2390', 'greeting', 'Hello World!'], {}, async())
    }, function () {
        bin({}, ['set', '127.0.0.1:2390', 'greeting2', 'Hello World!'], {}, async())
        setTimeout(async(), 2500)
    }, function () {
        var data = semblance.shift().body.properties.greeting
        assert(data, 'Hello World!',
        'listener updated')
        bin({}, ['list', '127.0.0.1:2390'], {}, async())
    }, function (values) {
        assert(((values.indexOf('greeting\tHello World!\n') > -1) &&
        values.indexOf('greeting2\tHello World!\n') > -1), true, 'key set and retrieved')
       bin({}, ['register', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
       bin({}, ['register', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
        assert(ret.extant, true, 'duplicant registry')
        bin({}, ['deregister', '127.0.0.1:2390', 'blah:4001'], {}, async())
    }, function (ret) {
        assert(ret.success, true, 'deregistered')
        bin({}, ['registered', '127.0.0.1:2390'], {}, async())
    }, function (ret) {
        //bin({}, ['stop'], {}, async()) <-- need to pass for 100%.
        assert(ret, 'http://127.0.0.1:4077', 'registry listed')
        io.events.emit('SIGINT')
        server.close()
    })
}
