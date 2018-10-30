module.exports = function (previous, current) {
    return Buffer.compare(previous, current) != 0 ? current : null
}
