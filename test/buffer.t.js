require('proof')(3, (okay) => {
    const Configurator = require('../buffer')
    {
        const buffer = Buffer.from('a')
        const configurator = new Configurator
        okay(configurator.load(buffer).toString(), 'a', 'load')
    }
    {
        const buffer = Buffer.from('a')
        const configurator = new Configurator
        const same = configurator.reload(buffer, buffer)
        okay(same, null, 'no change')
        const change = configurator.reload(buffer, Buffer.from('b'))
        okay(change.toString(), 'b', 'changed')
    }
})
