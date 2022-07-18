const { Scenes } = require('telegraf');
const { CoinPair, P2POfferTrade } = require('../models');
const { selectBankKeyboard, removeKeyboard, baseKeyboard } = require('../keyboards');
const { getBanks, getCoins } = require('../utils/binanceApi');

const takerMakerScene = new Scenes.WizardScene(
    'TAKER_MAKER_SCENE',
    (ctx) => {
        ctx.reply('⚡ Select your bank ⚡', selectBankKeyboard);
        return ctx.wizard.next();
    },
    async (ctx) => {
        const bank = ctx.message?.text;
        if (bank === undefined || getBanks().includes(bank) === false) {
            ctx.reply('🚫 Please enter one of the suggested option 🚫');
            return;
        }

        const loops = [];
        const coins = getCoins();
        const exchangeCoinInfo = await CoinPair.find();
        const P2pOffers = await P2POfferTrade.find();
        const P2pSellOffers = P2pOffers.filter(offer => offer.tradeType === "SELL" && offer.bank === bank);

        for (let offer of P2pSellOffers) {
            for (let coin of coins) {
                if (coin === offer.asset) continue;

                const exchangePrice = exchangeCoinInfo.find(a => a.symbol === `${offer.asset}${coin}`)?.price;
                if (exchangePrice === undefined) continue;

                const coinPrices = P2pOffers.filter(a => a.tradeType === "SELL" && a.asset === coin);
                for (let coinPriceOffer of coinPrices) {
                    const rubToCoin = 100000 / offer.price;
                    const coinToCoin = rubToCoin * exchangePrice;
                    const coinToRub = coinToCoin * coinPriceOffer.price;

                    loops.push({
                        path: [bank, offer.asset, coin, coinPriceOffer.bank],
                        calc: [
                            rubToCoin,
                            coinToCoin,
                            Math.floor(coinToRub)
                        ],
                        tradePrice: [offer.price, coinPriceOffer.price],
                        exchangePrice: exchangePrice,
                        spread: (coinToRub / 100000) * 100 - 100
                    });
                }
            }
        }

        let sorted = loops.filter(a => a.spread < 20).sort((a, b) => b.spread - a.spread);

        let reply = `❇ ${sorted.length < 5 ? sorted.length : 5} Best Trade Loop (${new Date().toLocaleString()}) ❇\n❗ TAKER - MAKER ❗`
        await ctx.reply(reply, removeKeyboard);

        for (let i = 0; i < sorted.length && i < 5; i++) {
            reply = sorted[i].path.join(" ➡ ") + "\n";
            reply += "\n";
            reply += `💱 ${sorted[i].path[0]} ➡ ${sorted[i].path[1]} = ${sorted[i].tradePrice[0]}₽\n`
            reply += `💱 ${sorted[i].path[1]} ➡ ${sorted[i].path[2]} = ${sorted[i].exchangePrice}\n`
            reply += `💱 ${sorted[i].path[2]} ➡ ${sorted[i].path[3]} = ${sorted[i].tradePrice[1]}₽\n`
            reply += "\n";
            reply += "Initial money: 100 000₽\n"
            reply += `After purchase ${sorted[i].path[1]}: ${sorted[i].calc[0]} ${sorted[i].path[1]}\n`
            reply += `After conversion to ${sorted[i].path[2]}: ${sorted[i].calc[1]} ${sorted[i].path[2]}\n`
            reply += `Result: ${sorted[i].calc[2]}₽\n\n`
            reply += `Profit: ✅ ${sorted[i].calc[2] - 100000}₽ ✅\n`
            reply += `Spread: 🔥 ${sorted[i].spread.toFixed(2)}% 🔥\n`
            reply += "\n";

            await ctx.reply(reply, removeKeyboard);
        }


        reply = `❇❇❇ Back To Initial Bank: 3 Best Trade ❇❇❇`;
        await ctx.reply(reply, removeKeyboard);

        sorted = sorted.filter(a => a.path.at(-1) === bank);
        for (let i = 0; i < sorted.length && i < 3; i++) {
            reply = sorted[i].path.join(" ➡ ") + "\n";
            reply += "\n";
            reply += `💱 ${sorted[i].path[0]} ➡ ${sorted[i].path[1]} = ${sorted[i].tradePrice[0]}₽\n`
            reply += `💱 ${sorted[i].path[1]} ➡ ${sorted[i].path[2]} = ${sorted[i].exchangePrice}\n`
            reply += `💱 ${sorted[i].path[2]} ➡ ${sorted[i].path[3]} = ${sorted[i].tradePrice[1]}₽\n`
            reply += "\n";
            reply += "Initial money: 100 000₽\n"
            reply += `After purchase ${sorted[i].path[1]}: ${sorted[i].calc[0]} ${sorted[i].path[1]}\n`
            reply += `After conversion to ${sorted[i].path[2]}: ${sorted[i].calc[1]} ${sorted[i].path[2]}\n`
            reply += `Result: ${sorted[i].calc[2]}₽\n\n`
            reply += `Profit: ✅ ${sorted[i].calc[2] - 100000}₽ ✅\n`
            reply += `Spread: 🔥 ${sorted[i].spread.toFixed(2)}% 🔥\n`
            reply += "\n";

            await ctx.reply(reply, removeKeyboard);
        }

        ctx.reply("✅ P2p Binance parser main menu ✅", baseKeyboard);

        return ctx.scene.leave();
    }
)

module.exports = takerMakerScene;