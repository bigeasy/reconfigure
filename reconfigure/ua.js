var Vizsla = require('vizsla')
var cadence = require('cadence')

function UserAgent () {
    this._ua = new Vizsla
}

UserAgent.prototype.update = cadence(function (async, url, properties) {
    console.log(arguments)
    console.log(properties)
    this._ua.fetch({
            url: url,
            post: properties
    }, async())
})

module.exports = UserAgent
