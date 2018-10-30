var cadence = require('cadence')
var fs = require('fs')
var deepEqual = require('deep-equal')

module.exports = cadence(function (async, filename, previous) {
    async(function () {
        fs.readFile(filename, 'utf8', async())
    }, function (current) {
        var json = JSON.parse(current)
        return ! deepEqual(json, previous, { strict: true }) ? json : null
    })
})
