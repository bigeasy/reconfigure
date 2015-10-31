var cadence = require('cadence')
var Dispatcher = require('inlet/dispatcher')
var logger = require('prolific').createLogger('diverter.allocator')
var Consensus = require('./consensus')
var Coordinator = require('./coordinator')
var useragent = require('./ua')

function Reconfigure (key, host, port, listener) {
    this._coordinator = new Coordinator(
        new Consensus(key, host, port, listener), // uninitialized
        new useragent()
    )
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

Reconfigure.prototype.register = cadence(function (async, listener) {
    this._coordinator.listen(listener, async())
})

Reconfigure.prototype.deregister = cadence(function (async, listener) {
    this._coordinator.unlisten(listener, async())
})

Reconfigure.prototype.set = cadence(function (async, key, value) {
    this._coordinator.set(key, value, async())
})

Reconfigure.prototype.list = cadence(function (async) {
})

module.exports = Reconfigure
