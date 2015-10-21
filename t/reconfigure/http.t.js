require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var UserAgent = require('vizsla')
    var Reconfigure = require('../../reconfigure/http')
    var reconfigure = new Reconfigure
    var http = require('http')
    var server = http.createServer(reconfigure.dispatcher({}).server())
    var ua = new UserAgent, session = { url: 'http://127.0.0.1:8077' }
    async(function () {
        server.listen(8077, '127.0.0.1', async())
    }, function () {
        ua.fetch(session, async())
    }, function (body) {
        assert(body.toString(), 'Reconfigure API', 'index')
    }, function () {
         server.close(async())
    })
}
