const path = require('path')
const fs = require('fs')
const file = path.resolve(__dirname, 'conf.js')
const dir = path.dirname(file)
const watcher = fs.watch(dir)

watcher.on('change', (eventType, filename) => {
    console.log(eventType, filename)
    try {
        console.log(fs.statSync(path.resolve(__dirname, filename)))
    } catch (error) {
        if (error.code != 'ENOENT') {
            throw error
        }
    }
})
