class StringConfiguration {
    load (buffer) {
        return buffer.toString()
    }
    compare (previous, buffer) {
        const string = buffer.toString()
        return previous != string ? string : null
    }
}

module.exports = StringConfiguration
