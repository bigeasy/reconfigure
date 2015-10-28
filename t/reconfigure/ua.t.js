require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var UserAgent = require('../../reconfigure/ua')
    var ua = new UserAgent()

    var http = require('http')
    var Semblance = require('semblance')
    var semblance = new Semblance
    var server = http.createServer(semblance.dispatch()), request

    async(function () {
        server.listen(4077, '127.0.0.1', async())
    }, function () {
        ua.update('http://127.0.0.1:4077', { key: 'value' }, async())
    }, function () {
        var got = semblance.shift()
        delete got.headers.connection
        assert(got, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'content-length': '30',
                host: '127.0.0.1:4077'
            },
            url: '/',
            body: { properties: { key: 'value' } }
        }, 'token')
        server.close(async())
    })
}
