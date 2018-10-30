var deepEqual = require('deep-equal')

module.exports = function (previous, current) {
    var json = JSON.parse(current)
    return ! deepEqual(json, previous, { strict: true }) ? json : null
}
