require('proof')(3, (okay) => {
    const Configurator = require('../json')
    {
        const configurator = new Configurator
        const json = configurator.load(Buffer.from('{"x":1}'))
        okay(json, { x: 1 }, 'load')
    }
    {
        const configurator = new Configurator
        const same = configurator.reload({ x: 1 }, Buffer.from('{"x":1}'))
        okay(same, null, 'no change')
        const change = configurator.reload({ x: 1 }, Buffer.from('{"x":2}'))
        okay(change, { x: 2 }, 'changed')
    }
})
