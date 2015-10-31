var cadence = require('cadence')
var Dispatcher = require('inlet/dispatcher')
var logger = require('prolific').createLogger('diverter.allocator')
var Consensus = require('./consensus')
var Coordinator = require('./coordinator')
var useragent = require('./ua')

function Reconfigure () {
/*
function Reconfigure (key, host, port, listener) {
    this._coordinator = new Coordinator(
        new Consensus(key, host, port, listener), // uninitialized
        new useragent()
    )
*/
}

Reconfigure.prototype.dispatcher = function (options) {
    var dispatcher = new Dispatcher(this)
    dispatcher.dispatch('GET /', 'index')
    dispatcher.dispatch('POST /register', 'register')
    dispatcher.dispatch('POST /deregister', 'deregister')
    dispatcher.dispatch('POST /set', 'set')
    dispatcher.dispatch('GET /list', 'list')
    return dispatcher.createDispatcher()
}

Reconfigure.prototype.index = cadence(function (async) {
    return 'Reconfigure API'
})

Reconfigure.prototype.register = cadence(function (async, post) {
    return 'listener ' + post.body.url + ' has joined'
/*
    async(function () {
        this._coordinator.listen(post.body.url, async())
    }, function () {
        return 'listener ' + post.body.url + ' has joined'
    })
    */
})

Reconfigure.prototype.deregister = cadence(function (async, post) {
    return 'listener ' + post.body.url + ' has left'
/*
    async(function () {
        this._coordinator.unlisten(post.body.url, async())
    }, function () {
        return 'listener ' + post.body.url + ' has left'
    })
*/
})

/*
Reconfigure.prototype.set = cadence(function (async, key, value) {
    async(function () {
        this._coordinator.set(post.body.key, post.body.value, async())
    }, function () {
        return 'listener at ' + body.headers.host + ' set \'' + key + '\' to ' + value
    }
})

Reconfigure.prototype.list = cadence(function (async) {
    async(function () {
        this._coordinator.list(async())
    }, function (list) {
        return { values: list }
    }
})
*/
module.exports = Reconfigure
