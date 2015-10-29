#!/usr/bin/env/node

/*

   Provide a command-line interface for `reconfigure`.
  ___ greeting, usage ___ en_US ___
  usage: node.bin.js

  ___ serve, usage ___ en_US ___
  usage: node bin.js reconfigure server

  options:
  -l, --listen      [string]    IP and port to bind to.
  -i, --id          [string]    reconfigure instance ID (or IP)
  ___ ___ ___
*/

require('arguable')(module, require('cadence')(function (async, options) {
    var UserAgent = require('./reconfigure/ua.js')
    var Consensus = require('./reconfigure/consensus.js')
    var Coordinator = require('./reconfigure/coordinator.js')
    var http = require ('./reconfigure/http.js')
    switch (options.command[0]) {
        case 'serve':
            console.log('coming soon')
            serve(options.param.listen.split(':'))
            break

        case 'greeting':
            if (options.param.string != null) {
                console.log(options.param.string)
            } else {
                console.log('Hello, World!')
            }
            break
    }

    function serve (ip) {
        var port
        if (ip.length) {
            port = ip[1]
            ip = ip[0]
        } else {
            port = '8080'
            ip = ip[0]
        }
        async(function () {
            var server = new http({
                coordinator: new Coordinator(
                    new Consensus('reconfigure', ip, port, async()),
                    new UserAgent()
                )
            })
            var disp = server.dispatcher()
            disp.server()
        }, function () {
            //Consensus stopped
        })
    }
}))
