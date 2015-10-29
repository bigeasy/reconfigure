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
    switch (options.command[0]) {
        case 'serve':
            console.log('coming soon')
            if ((options.param.listen != null) || (options.param.id != null)) {
                console.log('bind:' + options.param.listen + ' id:' + options.param.id)
            }
            break
        case 'greeting':
            if (options.param.string != null) {
                console.log(options.param.string)
            } else {
                console.log('Hello, World!')
            }
            break
    }
}))
