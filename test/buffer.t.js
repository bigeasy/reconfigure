require('proof')(2, prove)

function prove (okay) {
    var Comparator = require('../buffer')
    okay(Comparator(Buffer.from('a'), Buffer.from('a')), null, 'unchanged')
    okay(Comparator(Buffer.from('a'), Buffer.from('b')).toString(), 'b', 'changed')
}
