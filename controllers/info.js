const { baseKeyboard } = require("../keyboards");

const getBotInfo = async ctx => {
    return await ctx.reply('Binance price checker v1.0.0.\nhttps://github.com/gryaznykh-ivan', baseKeyboard);
}

const getBotSettings = async ctx => {
    return await ctx.reply('✅ Volume: 100 000₽\n✅ Min order count: 10\n✅ Min finish rate: 90%');
}

module.exports = {
    getBotInfo,
    getBotSettings
}