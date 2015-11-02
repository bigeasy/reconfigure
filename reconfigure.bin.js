/*
    ___ serve, usage ___ en_US ___
    usage: node reconfigure.bin.js serve <args>

        -i, --ip        <string>    address to bind to
        -p, --port      <integer>   port to bind to
        -l, --log       <string>    path to a log file
        -a, --etcdaddr <string>    etcd address and port to listen to
            --help                  display this message
    ___ serve, $ ___ en_US ___

    ___ set, usage ___ en_US ___
    usage: node reconfigure.bin.js set <args>

        -k, --key       <string>    key to set
        -v, --value     <string     value to set

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

    ___ . ___
*/

var Reconfigure = require('./reconfigure/http')
var http = require('http')
var Coordinator = require('./reconfigure/coordinator')
var Consensus = require('./reconfigure/consensus')
var UserAgent = require('./reconfigure/ua')

require('arguable')(module, require('cadence')(function (async, options) {
    var reconfigure, coord, etcdport
    options.helpIf(options.param.help)
//    options.required('ip')
    options.param.ip || (options.param.ip = '127.0.0.1')
    options.param.etcdaddr || (options.param.etcdaddr = '127.0.0.1:2379')
    options.param.port || (options.param.port = 8080)

    options.validate('%s is not integer', 'port', /^\d+$/)
    etcdport = options.param.etcdaddr.split(':')[1]

    async(function () {
        coord = new Coordinator(
            new Consensus(
                options.param.ip, // switch to key
                options.param.etcdaddr.split(':')[0],
                etcdport,
                function () {} //panic
            ),
            new UserAgent()
        )
    }, function () {
        coord._consensus.initialize(async())
    }, function () {
        var reconfigure = new Reconfigure(coord)
        switch (options.command) {
            case 'serve':
                    var server = http.createServer(reconfigure.dispatcher().server())
                    options.signal('SIGINT', function () { server.close() })
                    server.listen(options.param.port, options.param.ip, async())
                break
            case 'set':
                break
        }
    })
}))
