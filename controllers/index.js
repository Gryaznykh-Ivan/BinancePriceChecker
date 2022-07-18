const { MakerMaker, MakerTaker, TakerMaker, TakerTaker } = require('./interface');
const { getBotInfo, getBotSettings } = require('./info');
const { parse } = require('./parser');

module.exports = {
    endpoints: {
        MakerMaker,
        MakerTaker,
        TakerMaker,
        TakerTaker,
        getBotInfo,
        getBotSettings
    },
    parse
}
