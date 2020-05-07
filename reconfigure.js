const fileSystem = require('fs')
const fs = require('fs').promises
const path = require('path')
const events = require('events')
const noop = require('nop')

class Reconfigurator extends events.EventEmitter {
    constructor (configuration, configurator) {
        super()
        this.destroyed = false
        this._configuration = configuration
        this._configurator = configurator
        this._previous = []
        this._changes = [{ method: 'load' }]
        this._notify = noop
        const dir = path.dirname(this._configuration)
        const file = path.basename(this._configuration)
        this._watcher = fileSystem.watch(dir)
        this._watcher.on('change', (method, changed) => {
            if (changed == file) {
                this._push({ method })
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

    unshift (buffer) {
        this._push({ method: 'unshift', buffer })
    }

    async _reconfigure (buffer, force) {
        const previous = this._previous[this._previous.length - 1]
        const configuration = await this._configurator.reload(previous, buffer, force)
        if (configuration != null) {
            this._previous.push(configuration)
            return configuration
        }
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
            if (action.method == 'load') {
                const method = 'configuration'
                const buffer = await fs.readFile(this._configuration)
                const body = await this._configurator.load(buffer)
                this._previous.push(body)
                return { method: 'configure', body }
            } else {
                try {
                    switch (action.method) {
                    case 'unshift': {
                            return {
                                method: 'configure',
                                body: await this._reconfigure(action.buffer, true)
                            }
                        }
                    case 'rename':
                    case 'change': {
                            const body = await this._reconfigure(await fs.readFile(this._configuration), false)
                            if (body != null) {
                                return { method: 'configure', body }
                            }
                        }
                        break
                    }
                } catch (error) {
                    return {
                        method: 'error',
                        body: error
                    }
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
