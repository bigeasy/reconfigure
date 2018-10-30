require('proof')(2, prove)

function prove (okay) {
    var Comparator = require('../json')
    okay(Comparator({ x: 1 }, '{"x":1}'), null, 'unchanged')
    okay(Comparator({ x: 1 }, '{"x":2}'), { x: 2 }, 'changed')
}
