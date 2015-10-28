var Vizsla = require('vizsla')
var cadence = require('cadence')

function UserAgent () {
    this._ua = new Vizsla
}

UserAgent.prototype.update = cadence(function (async, data) {
    this._ua.fetch({ url : data.url }, {
        post: { properties: data.properties }
    }, async())
})

module.exports = UserAgent
