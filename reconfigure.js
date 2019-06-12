const fileSystem = require('fs')
const fs = require('fs').promises
const path = require('path')
const events = require('events')

const Queue = require('avenue')

class Reconfigurator extends events.EventEmitter {
    constructor (configuration, configurator) {
        super()
        this.destroyed = false
        this._configuration = configuration
        this._configurator = configurator
        this._previous = []
        this._changes = new Queue().shifter().paired
        const dir = path.dirname(this._configuration)
        const file = path.basename(this._configuration)
        this._changes.queue.push('load')
        this._watcher = fileSystem.watch(dir)
        this._watcher.on('change', (type, changed) => {
            if (changed == file) {
                this._changes.queue.sync.push(type)
            }
        })
        this._watcher.once('close', () => this._changes.queue.sync.push(null))
    }

    destroy () {
        if (!this.destroyed) {
            this.destroyed = true
            this._watcher.close()
        }
    }

    async shift () {
        for (;;) {
            const action = await this._changes.shifter.shift()
            if (action == null) {
                return null
            }
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
