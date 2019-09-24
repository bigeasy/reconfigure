const path = require('path')
const fs = require('fs')
const file = path.resolve(__dirname, 'conf.js')
const dir = path.dirname(file)
const watcher = fs.watch(dir)

let last = 0
watcher.on('change', (eventType, filename) => {
    console.log(eventType, filename)
    try {
        const now = Date.now()
        console.log(now - last, fs.statSync(path.resolve(__dirname, filename)))
        last = now
    } catch (error) {
        if (error.code != 'ENOENT') {
            throw error
        }
    }
})
