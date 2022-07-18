const { Markup } = require("telegraf");
const { getBanks } = require("../utils/binanceApi");

const baseKeyboard = {
    "reply_markup": {
        "inline_keyboard": [
            [{ text: "MAKER-MAKER", callback_data: "MakerMaker" }, { text: "TAKER-MAKER", callback_data: "TakerMaker" }],
            [{ text: "MAKER-TAKER", callback_data: "MakerTaker" }, { text: "TAKER-TAKER", callback_data: "TakerTaker" }],
            [{ text: "Show Settings", callback_data: "getBotSettings" }],
            [{ text: "Information", callback_data: "getBotInfo" }]
        ],
    }
};

const selectBankKeyboard = Markup.keyboard(
    getBanks().reduce((a, c, i) => {
        if (i !== 0 && i % 2 !== 0) {
            a[a.length - 1].push(c);
        } else {
            a[a.length] = [c];
        }
    
        return a;
    }, [])
);

const removeKeyboard = Markup.removeKeyboard();

module.exports = {
    baseKeyboard,
    selectBankKeyboard,
    removeKeyboard
}