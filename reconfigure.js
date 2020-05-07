const fileSystem = require('fs')
const fs = require('fs').promises
const path = require('path')
const events = require('events')

class Reconfigurator extends events.EventEmitter {
    constructor (configuration, configurator) {
        super()
        this.destroyed = false
        this._configuration = configuration
        this._configurator = configurator
        this._previous = []
        this._changes = [ 'load' ]
        this._notify = () => {}
        const dir = path.dirname(this._configuration)
        const file = path.basename(this._configuration)
        this._watcher = fileSystem.watch(dir)
        this._watcher.on('change', (type, changed) => {
            if (changed == file) {
                this._push(type)
            }
        })
        this._watcher.once('close', () => {
            this.destroyed = true
            this._notify.call()
        })
    }

    destroy () {
        if (!this.destroyed) {
            this.destroyed = true
            this._watcher.close()
        }
    }

    _push (action) {
        this._changes.push(action)
        this._notify.call()
    }

    async shift () {
        for (;;) {
            if (this.destroyed) {
                return null
            }
            if (this._changes.length == 0) {
                await new Promise(resolve => this._notify = resolve)
                continue
            }
            const action = this._changes.shift()
            console.log(action)
            switch (action) {
            case 'load':
                const method = 'configuration'
                const buffer = await fs.readFile(this._configuration)
                const configuration = await this._configurator.load(buffer)
                this._previous.push(configuration)
                return configuration
            case 'rename':
            case 'change':
                try {
                    const method = 'configuration'
                    const buffer = await fs.readFile(this._configuration)
                    const previous = this._previous[this._previous.length - 1]
                    const configuration = await this._configurator.reload(previous, buffer)
                    if (configuration != null) {
                        this._previous.push(configuration)
                        return configuration
                    }
                } catch (error) {
                    this.emit('error', error)
                }
            }
        }
    }

    [Symbol.asyncIterator]() {
        return {
            next: async () => {
                const value = await this.shift()
                if (value == null) {
                    return { done: true }
                }
                return { done: false, value }
            }
        }
    }
}

module.exports = Reconfigurator
