/*
    ___ usage ___ en_US ___
    usage: node reconfigure.bin.js

        -i, --ip        <string>    address to bind to
        -p, --port      <integer>   port to bind to
        -l, --log       <string>    path to a log file
            --help                  display this message

    ___ $ ___ en_US ___

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
    var reconfigure, coord
    options.helpIf(options.param.help)
//    options.required('ip')

    options.param.ip || (options.param.ip = '127.0.0.1')
    options.param.port || (options.param.port = 8080)

    options.validate('%s is not integer', 'port', /^\d+$/)

    /*
    async(function () {
        async(function () {
            coord = new Coordinator(
                new Consensus(
                    options.param.ip, // switch to key
                    options.param.ip,
                    options.param.port,
                    async()
                ),
                new UserAgent()
            )
        }, function () {
            // panic
        })
    }, function () {
    */
        var reconfigure = new Reconfigure
        var server = http.createServer(reconfigure.dispatcher().server())
        options.signal('SIGINT', function () { server.close() })
        server.listen(options.param.port, options.param.address, async())
    //})
}))
