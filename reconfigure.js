var fs = require('fs')
var cadence = require('cadence')
var delta = require('delta')
var Demur = require('demur')
var logger = require('prolific.logger').createLogger('prolific.supervisor')
var coalesce = require('extant')
var dirty = require('./dirty')

function Reconfigurator (path) {
    this._path = path
    this._change = null
    this._demur = new Demur({ maximum: 60000, immediate: true })
    this.destroyed = false
}

Reconfigurator.prototype.destroy = function () {
    this.destroyed = true
    this._demur.cancel()
    if (this._change != null) {
        this._change.cancel()
    }
}

Reconfigurator.prototype.monitor = cadence(function (async, contents) {
    this._demur.reset()
    var start = Date.now()
    var loop = async(function () {
        this._demur.retry(async())
    }, function () {
        if (this.destroyed) {
            return [ loop.break, null ]
        } else {
            try {
                var watcher = fs.watch(this._path)
            } catch (error) {
                logger.error('watch', {
                    path: this._path,
                    code: coalesce(error.code),
                    stack: error.stack
                })
                return
            }
            async([function () {
                watcher.close()
            }], function () {
                async(function () {
                    this._change = delta(async()).ee(watcher).on('change')
                }, [function () {
                    this._change = null
                }], function () {
                    async([function () {
                        dirty(this._path, contents, async())
                    }, function (error) {
                        logger.error('read', {
                            path: this._path,
                            code: coalesce(error.code),
                            stack: error.stack
                        })
                        return [ loop.continue ]
                    }], function (changed) {
                        if (changed != null) {
                            return [ loop.break, changed ]
                        }
                    })
                })
                async([function () {
                    dirty(this._path, contents, async())
                }, function (error) {
                    return true
                }], function (dirty) {
                    if (dirty != null) {
                        this._change.cancel()
                    }
                    return []
                })
            })
        }
    })()
})

module.exports = Reconfigurator
