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

require('arguable')(module, require('cadence')(function (async, options) {
    options.helpIf(options.param.help)
//    options.required('ip')

    options.param.ip || (options.param.ip = '127.0.0.1')
    options.param.port || (options.param.port = 8080)

    options.validate('%s is not integer', 'port', /^\d+$/)

    var reconfigure = new Reconfigure

    var server = http.createServer(reconfigure.dispatcher().server())
    options.signal('SIGINT', function () { server.close() })
    server.listen(options.param.port, options.param.address, async())
}))
