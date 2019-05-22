describe('json', () => {
    const assert = require('assert')
    const Configurator = require('../json')
    it('can load', () => {
        const configurator = new Configurator
        const json = configurator.load(Buffer.from('{"x":1}'))
        assert.deepStrictEqual(json, { x: 1 }, 'load')
    })
    it('can reload', () => {
        const configurator = new Configurator
        const same = configurator.reload({ x: 1 }, Buffer.from('{"x":1}'))
        assert.equal(same, null, 'no change')
        const change = configurator.reload({ x: 1 }, Buffer.from('{"x":2}'))
        assert.deepStrictEqual(change, { x: 2 }, 'changed')
    })
})
