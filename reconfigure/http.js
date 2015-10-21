var cadence = require('cadence')
var Dispatcher = require('inlet/dispatcher')
var logger = require('prolific').createLogger('diverter.allocator')

function Reconfigure () {
}

Reconfigure.prototype.dispatcher = function (options) {
    var dispatcher = new Dispatcher(this)
    dispatcher.dispatch('GET /', 'index')
/*
    dispatcher.dispatch('POST /register', 'register')
    dispatcher.dispatch('POST /deregister', 'deregister')
    dispatcher.dispatch('POST /set', 'set')
    dispatcher.dispatch('GET /list', 'list')
*/
    return dispatcher.createDispatcher()
}

Reconfigure.prototype.index = cadence(function (async) {
    return 'Reconfigure API'
})

module.exports = Reconfigure
