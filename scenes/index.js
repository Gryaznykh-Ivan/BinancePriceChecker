const makerMaker = require('./makermaker');
const makerTaker = require('./makertaker');
const takerMaker = require('./takermaker');
const takerTaker = require('./takertaker');

module.exports = [
    makerMaker,
    makerTaker,
    takerMaker,
    takerTaker
]