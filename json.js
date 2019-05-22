var deepEqual = require('deep-equal')

class JSONConfiguration () {
    load (buffer) {
        return JSON.parse(buffer.toString())
    }
    compare (previous, buffer) {
        const json = JSON.parse(current.toString())
        return ! deepEqual(json, previous, { strict: true }) ? json : null
    }
}

module.exports = JSONConfiguration
