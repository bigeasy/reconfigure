class BufferConfigurator {
    configure (buffer) {
        return buffer
    }
    load (buffer) {
        return this.configure(buffer)
    }
    reload (previous, buffer, force) {
        return force || Buffer.compare(previous, buffer) != 0 ? this.configure(buffer) : null
    }
}

module.exports = BufferConfigurator
