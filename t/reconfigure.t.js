require('proof')(3, prove)

function prove (okay, callback) {
    var Reconfigurator = require('../reconfigure')

    var path = require('path')
    var fs = require('fs')
    var fse = require('fs-extra')

    var Signal = require('signal')

    var cadence = require('cadence')
    var coalesce = require('extant')
    var Destructible = require('destructible')
    var destructible = new Destructible('t/watcher.t')

    destructible.completed.wait(callback)

    cadence(function (async) {
        var configuration = {
            template: path.join(__dirname, 'configuration.json'),
            copy: path.join(__dirname, 'configuration.copy.json')
        }

        try {
            fs.unlinkSync(configuration.copy)
        } catch (error) {
        }

        var responses = [{
            value: null,
            signal: new Signal
        }, {
            value: 'x',
            signal: new Signal
        }, {
            value: 'x',
            signal: new Signal
        }, {
            value: JSON.parse(fs.readFileSync(configuration.template, 'utf8')),
            signal: new Signal
        }]

        var signals = responses.map(function (response) {
            return response.signal
        })

        var signal = responses[0].signal

        var reconfigurator = new Reconfigurator(configuration.copy)
        var contents = JSON.parse(fs.readFileSync(configuration.template, 'utf8'))
        var modified = JSON.parse(JSON.stringify(contents))

        async(function () {
            reconfigurator.monitor(contents, async())
            setTimeout(function () {
                fse.copySync(configuration.template, configuration.copy)
                setTimeout(function () {
                    modified.x = 2
                    fs.writeFileSync(configuration.copy, JSON.stringify(modified), 'utf8')
                }, 250)
            }, 250)
        }, function (object) {
            okay(object, {
                accept: false,
                chain: [{ path: '.', level: 'warn', accept: true }],
                pipeline: [{ module: 'prolific.test' }],
                x: 2
            }, 'changed')
            fs.writeFileSync(configuration.copy, '{', 'utf8')
            reconfigurator.monitor(JSON.parse(JSON.stringify(modified)), async())
            setTimeout(function () {
                modified.x = 1
                fs.writeFileSync(configuration.copy, JSON.stringify(modified), 'utf8')
            }, 250)
        }, function (object) {
            okay(object, {
                accept: false,
                chain: [{ path: '.', level: 'warn', accept: true }],
                pipeline: [{ module: 'prolific.test' }],
                x: 1
            }, 'changed back')
            reconfigurator.monitor(JSON.parse(JSON.stringify(modified)), async())
            setTimeout(function () {
                fs.writeFileSync(configuration.copy, JSON.stringify(modified), 'utf8')
                setTimeout(function () {
                    reconfigurator.destroy()
                    reconfigurator.destroy()
                })
            }, 250)
        }, function (object) {
            okay(object, null, 'object')
        })
    })(destructible.monitor('test'))
}
