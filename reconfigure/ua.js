var Vizsla = require('vizsla')
var cadence = require('cadence')

function UserAgent () {
    this._ua = new Vizsla
}

UserAgent.prototype.update = cadence(function (async, url, properties) {
    async(function () {
        this._ua.fetch({
                url: url,
                post: { properties: properties }
        }, async())
    }, function (body, response) {
        return response.okay
    })
})

module.exports = UserAgent
