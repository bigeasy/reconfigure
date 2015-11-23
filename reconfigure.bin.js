/*
    ___ serve, usage ___ en_US ___
    usage: node reconfigure.bin.js serve <args>

        -i, --ip        <string>    address to bind to
        -p, --port      <integer>   port to bind to
        -l, --log       <string>    path to a log file
        -e, --etcdaddr <string>    etcd address and port
            --help                  display this message
    ___ serve, $ ___ en_US ___

        first is required:
            error: the `--first` URL is a required argument

        second is required:
            the `--second` URL is a required argument

        divisor is required:
            the `--divisor` is a required argument

        divisor is not integer:
            the `--divisor` must be an integer

        port is not integer:
            the `--port` must be an integer

    ___ set, usage ___ en_US ___
    usage: node reconfigure.bin.js set [address] [key] [value] <args>

    ___ list, usage ___ en_US ___
    usage: node reconfigure.bin.js list <args>

    ___ register, usage ___ en_US ___
    usage: node reconfigure.bin.js register <args>

    ___ deregister, usage ___ en_US ___
    usage: node reconfigure.bin.js deregister <args>

    ___ registered, usage ___ en_US ___
    usage: node reconfigure.bin.js registered <args>

    ___ . ___
*/

var Reconfigure = require('./reconfigure/http')
var http = require('http')
var Coordinator = require('./reconfigure/coordinator')
var Consensus = require('./reconfigure/consensus')
var UserAgent = require('./reconfigure/ua')
var Vizsla = require('vizsla')
var abend = require('abend')

require('arguable')(module, require('cadence')(function (async, options) {
    var reconfigure, coord, etcdport, server
    var ua = new Vizsla()
    options.helpIf(options.param.help)
    options.param.ip || (options.param.ip = '127.0.0.1')
    options.param.etcdaddr || (options.param.etcdaddr = '127.0.0.1:2379')
    options.param.port || (options.param.port = 8080)

    options.validate('%s is not integer', 'port', /^\d+$/)
    var etcd = options.param.etcdaddr

    switch (options.command[0]) {
        case 'serve':
            async(function () {
                coord = new Coordinator(
                    new Consensus(
                        options.param.ip + options.param.port,
                        etcd.split(':')[0],
                        etcd.split(':')[1],
                        function (status, key, callback) {
                            coord.update(callback)
                        }
                    ),
                    new UserAgent()
                )
                coord._consensus.initialize(async())
            }, function () {
                coord._consensus.watch(abend)
            }, function () {
                var reconfigure = new Reconfigure(coord)
                var server = http.createServer(reconfigure.dispatcher().server())
                options.signal('SIGINT', function () {
                    server.close()
                    coord._consensus.stop()
                })
                server.listen(options.param.port, options.param.ip, async())
            })
            break

        case 'set':
            ua.fetch({
                url: 'http://' + options.argv[0]
            }, {
                url: '/set',
                post: {
                    key: options.argv[1],
                    value: options.argv[2]
                }
            }, async())
            break

        case 'list':
            async(function () {
                ua.fetch({
                    url: 'http://' + options.argv[0]
                }, {
                    url: '/list'
                }, async())
            }, function (list) {
                var s = ''
                for (var v in list.values) {
                    s += v + '\t' + list.values[v] + '\n'
                }
                return s
            })
            break

        case 'registered':
            async(function () {
                ua.fetch({
                    url: 'http://' + options.argv[0]
                }, {
                    url: '/registered'
                }, async())
            }, function (list) {
                return list.listeners
            })
            break

        case 'register':
            ua.fetch({
                    url: 'http://' + options.argv[0]
            }, {
                url: '/register',
                post: {
                    url: options.argv[1]
                }
            }, async())
            break

        case 'deregister':
            ua.fetch({
                    url: 'http://' + options.argv[0]
            }, {
                url: '/register',
                post: {
                    url: options.argv[1]
                }
            }, async())
            break

        case 'stop':
            break
        }
}))
