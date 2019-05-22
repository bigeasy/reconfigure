const fileSystem = require('fs')
const fs = require('fs').promises
const path = require('path')
const events = require('events')

const Queue = require('avenue')

class Reconfigurator extends events.EventEmitter {
    constructor (path, formatter, validator) {
        super()
        this.destroyed = false
        this._path = path
        this._Comparator = Comparator
        this._change = null
        this._watcher = null
        this._changes = new Queue().shifter().paired
        this._configurations = new Queue().shifter().paired
    }

    destroy () {
        if (!this.destroyed) {
            this.destroyed = true
            if (this._watcher != null) {
                this._watcher.close()
            }
        }
    }

    async _changed (entry) {
        if (entry == null) {
            this._configurations.queue.push(null)
        } else {
            switch (entry.name) {
            case 'load':
                try {
                    const method = 'configuration'
                    const buffer = await fs.readFile(this._path)
                    const formatted = this._format.load(buffer)
                    const configuration = await this._validator.call(null, formatted)
                    this._previous.push(configuration)
                    this._configurations.queue.enqueue([{ method, configuration ]})
                } catch (error) {
                    const method = 'error'
                    await this._configurations.queue.enqueue([{ method, error }])
                }
                break
            case 'rename':
            case 'change':
                try {
                    const method = 'configuration'
                    const buffer = await fs.readFile(this._path)
                    const previous = this._previous[this._previous.length - 1]
                    const formatted = this._format.compare(previous, buffer)
                    if (formatted != null) {
                        const configuration = await this._validator.call(null, formatted)
                        this._previous.push(configuration)
                        this._configurations.queue.enqueue([{ method, configuration ]})
                    }
                } catch (error) {
                    this.emit('error', error)
                }
                break
            }
        }
    }

    async monitor () {
        const dir = path.dirname(this._path)
        const file = path.basename(this._path)
        this._changes.queue.push({ type: 'load' })
        this._watcher = fileSystem.watch(this._dir)
        this._watcher.on('change', (type, file) => {
            if (file == this._file) {
                this._changes.queue.push(type)
            }
        })
        this._watcher.once('close', () => this._changes.queue.push(null))
        return this._changes.shifter().pump(this._changed.bind(this))
    }

    async configuration () {
        const entry = this._shifter.shift()
        switch (entry.method) {
        case 'error':
            throw entry.error
        case 'configuration':
            return entry.configuration
        }
    }
}

module.exports = Reconfigurator
