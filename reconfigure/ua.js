var Vizsla = require('vizsla')
var cadence = require('cadence')

function UserAgent (url) {
    this._ua = new Vizsla
    this._session = { url: url }
}

UserAgent.prototype.update = cadence(function (async, properties) {
    this._ua.fetch(this._session, {
        payload: { properties: properties }
    }, async())
})

module.exports = UserAgent
