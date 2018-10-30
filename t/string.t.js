require('proof')(2, prove)

function prove (okay) {
    var Comparator = require('../string')
    okay(Comparator('a', 'a'), null, 'unchanged')
    okay(Comparator('a', 'b'), 'b', 'changed')
}
