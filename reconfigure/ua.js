var Vizsla = require('vizsla')
var cadence = require('cadence')

function UserAgent () {
    this._ua = new Vizsla
}

UserAgent.prototype.update = cadence(function (async, url, properties) {
    this._ua.fetch({ url : url }, {
        payload: { properties: properties }
    }, async())
})

module.exports = UserAgent
