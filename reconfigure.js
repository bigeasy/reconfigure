const fileSystem = require('fs')
const fs = require('fs').promises
const path = require('path')
const events = require('events')
const noop = require('nop')
const Interrupt = require('interrupt')

class Reconfigurator extends events.EventEmitter {
    static Error = Interrupt.create('Reconfigure.Error')
    // We do not want any sort of race condition, so we start watching before we
    // load the initial file. If we start watching after the initial file is
    // loaded there is a window where the file may change from the original load
    // undetected.

    // Note that the watcher only tells us that there is a change which makes us
    // reload, so the file we load may itself be stale, but eventually we'll get
    // to the latest version of the file on disk, which is all that matters.

    //
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
            this._push(null)
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
        try {
            const previous = this._previous[this._previous.length - 1]
            const configuration = await this._configurator.reload(previous, buffer, force)
            if (configuration != null) {
                this._previous.push(configuration)
                return configuration
            }
        } catch (error) {
            throw new Reconfigurator.Error('configure', error, {}, { buffer })
        }
    }

    async shift () {
        for (;;) {
            if (this._changes.length == 0) {
                await new Promise(resolve => this._notify = resolve)
            }
            const action = this._changes.shift()
            if (action == null) {
                this._watcher.close()
                return null
            }
            if (action.method == 'load') {
                try {
                    const method = 'configuration'
                    const buffer = await fs.readFile(this._configuration)
                    const body = await this._configurator.load(buffer)
                    this._previous.push(body)
                    return { method: 'configure', body }
                } catch (error) {
                    this.destroyed = true
                    this._watcher.close()
                    throw error
                }
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
