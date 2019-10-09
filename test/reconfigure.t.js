require('proof')(3, async (okay) => {
    const path = require('path')
    const callback = require('prospective/callback')
    const fs = require('fs').promises
    const Reconfigurator = require('..')
    const file = path.join(__dirname, 'configuration.json')
    const Configurator = require('../json')
    const test = []
    try {
        await fs.unlink(file)
    } catch (error) {
    }
    try {
        await fs.unlink(path.join(__dirname, 'configuration.foo'))
    } catch (error) {
    }
    await fs.writeFile(file, '{ "x": 1 }')
    const reconfigurator = new Reconfigurator(file, new Configurator)
    reconfigurator.on('error', error => test.push('error'))
    const loop = (async () => {
        for await (let configuration of reconfigurator) {
            test.push(configuration)
        }
    })()
    await callback(callback => setTimeout(callback, 50))
    await fs.writeFile(path.join(__dirname, 'configuration.foo'), '{ "x": 1 }')
    await callback(callback => setTimeout(callback, 50))
    await fs.writeFile(file, '{ "x": 1 }')
    await callback(callback => setTimeout(callback, 50))
    okay(test.splice(0), [{ x: 1 }], 'load')
    await fs.writeFile(file, '{ "x": ')
    await callback(callback => setTimeout(callback, 50))
    // OS X generates one error, Linux two, so let's see that we get at
    // least one.
    okay(test.splice(0)[0], 'error', 'error')
    await fs.writeFile(file, '{ "x": 2 }')
    await callback(callback => setTimeout(callback, 50))
    reconfigurator.destroy()
    reconfigurator.destroy()
    okay(test.splice(0), [{ x: 2 }], 'reconfigure')
})
