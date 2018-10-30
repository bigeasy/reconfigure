module.exports = function (previous, current) {
    var string = current.toString()
    return previous != string ? string : null
}
