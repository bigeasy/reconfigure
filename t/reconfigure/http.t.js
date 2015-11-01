require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var UserAgent = require('vizsla')
    var Reconfigure = require('../../reconfigure/http')
    var coord = {
        listen: function (url, callback) {
            callback(null)
        },

        unlisten: function (url, callback) {
            callback(null)
        }
    }
    var reconfigure = new Reconfigure(coord)
    var http = require('http')
    var server = http.createServer(reconfigure.dispatcher({}).server())
    var ua = new UserAgent, session = { url: 'http://127.0.0.1:8077' }
    async(function () {
        server.listen(8077, '127.0.0.1', async())
    }, function () {
        ua.fetch(session, async())
    }, function (body) {
        assert(body.toString(), 'Reconfigure API', 'index')
        ua.fetch(session, {
            url: '/register',
            post: { url: 'blegh' }
        }, async())
    }, function (body) {
        assert(body.response, 'listener blegh has joined',
        'registered')
        ua.fetch(session, {
            url: '/deregister',
            post: { url: 'blegh' }
        }, async())
    }, function (body) {
        assert(body.response, 'listener blegh has left',
        'deregistered')
         server.close(async())
    })
}
