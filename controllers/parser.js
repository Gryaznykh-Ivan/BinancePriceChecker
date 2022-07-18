const { CoinPair, P2POfferTrade } = require('../models');
const {
    getBinanceP2POffers,
    getBinanceAllCoinExchangeInfo,
    getCoins,
    getBanks
} = require('../utils/binanceApi');

const delay = (s) => new Promise((resolve, _) => {
    return setTimeout(resolve, s * 1000)
})

const parseCourses = async () => {
    const exchangeInfo = await getBinanceAllCoinExchangeInfo();

    const coins = getCoins();
    const coinPairs = [];

    for (let coin of coins) {
        for (let coin1 of coins) {
            if (coin !== coin1) coinPairs.push(coin + "|" + coin1);
        }
    }
 
    for (let pair of exchangeInfo) {
        for (let coinPair of coinPairs) {
            if (pair.symbol === coinPair.split("|").join("")) {
                const reversePair = { 
                    symbol: coinPair.split("|").reverse().join(""),
                    price: Math.pow(+pair.price, -1)
                }

                await CoinPair.updateOne({ symbol: reversePair.symbol }, reversePair, { upsert: true });
                await CoinPair.updateOne({ symbol: pair.symbol }, pair, { upsert: true });

                break;
            }
        }
    }
}

const parseOrders = async () => {
    const coins = getCoins();
    const banks = getBanks();

    for (let coin of coins) {
        for (let bank of banks) {
            await delay(0.5);
            const buyResponse = await getBinanceP2POffers("BUY", coin, bank);
            if (buyResponse) {
                await P2POfferTrade.updateOne({ tradeType: buyResponse.tradeType, asset: buyResponse.asset, bank: buyResponse.bank }, buyResponse, { upsert: true });
            }

            await delay(0.5);
            const sellResponse = await getBinanceP2POffers("SELL", coin, bank);
            if (sellResponse) {
                await P2POfferTrade.updateOne({ tradeType: sellResponse.tradeType, asset: sellResponse.asset, bank: sellResponse.bank }, sellResponse, { upsert: true });
            }
        }
    }
}

const parse = async () => {
    console.log('Parse log: Started');

    await parseCourses();
    await parseOrders();
}

module.exports = {
    parse
}