class BufferConfiguration {
    load (buffer) {
        return buffer
    }
    compare (previous, buffer) {
        return Buffer.compare(previous, buffer) != 0 ? buffer : null
    }
}

module.exports BufferConfiguration
