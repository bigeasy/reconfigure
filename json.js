const deepEqual = require('fast-deep-equal')

class JSONConfigurator {
    configure (json) {
        return json
    }
    load (buffer) {
        return this.configure(JSON.parse(buffer.toString()))
    }
    reload (previous, buffer) {
        const json = JSON.parse(buffer.toString())
        return ! deepEqual(json, previous, { strict: true }) ? this.configure(json) : null
    }
}

module.exports = JSONConfigurator
