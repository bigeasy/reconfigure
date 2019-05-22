describe('buffer', () => {
    const assert = require('assert')
    const Configurator = require('../buffer')
    it('can load', () => {
        const buffer = Buffer.from('a')
        const configurator = new Configurator
        assert(configurator.load(buffer).toString(), 'a', 'load')
    })
    it('can reload', () => {
        const buffer = Buffer.from('a')
        const configurator = new Configurator
        const same = configurator.reload(buffer, buffer)
        assert.equal(same, null, 'no change')
        const change = configurator.reload(buffer, Buffer.from('b'))
        assert(change.toString(), 'b', 'changed')
    })
})
