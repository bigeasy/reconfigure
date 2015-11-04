require('proof')(4, require('cadence')(prove))

function prove (async, assert) {
    var UserAgent = require('vizsla')
    var Reconfigure = require('../../reconfigure/http')
    var coord = {
        listeners: [],
        listen: function (url, callback) {
            if (this.listeners.indexOf(url) > -1) {
                callback(null, {
                    duplicate: true,
                    success: true
                })
            } else {
                this.listeners.push(url)
                callback(null, {
                    success: false,
                    duplicate: false
                })
            }
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
        assert(body.url, 'blegh',
        'registered')
        ua.fetch(session, {
            url: '/register',
            post: { url: 'blegh' }
        }, async())
    }, function (body) {
        assert(body.extant, true, 'duplicant registry')
        ua.fetch(session, {
            url: '/deregister',
            post: { url: 'blegh' }
        }, async())
    }, function (body) {
        assert(body.success, true,
        'deregistered')
         server.close(async())
    })
}
