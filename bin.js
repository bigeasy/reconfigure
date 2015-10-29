#!/usr/bin/env/node

/*
  ___ usage ___ en_US ___
  usage: node bin.js [options]

   Provide a command-line interface for `reconfigure`.

  ___ greeting, usage ___ en_US ___
  usage: node bin.js greeting

  options:
  -s, --string      [string]    a string to print.
  ___ ___ ___
*/

require('arguable')(module, require('cadence')(function (async, options) {
    if (options.param.string != null) {
        console.log(options.param.string)
    } else {
        console.log('Hello, World!')
    }
}))
