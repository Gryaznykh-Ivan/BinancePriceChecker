const axios = require('axios');

const moneyAmount = 100000
const minSallerFinishRate = 0.90;
const minOrderCount = 5;

const getBanks = () => {
    return ["Tinkoff", "YandexMoney", "RosBank", "QIWI"]
}

const getCoins = () => {
    return ["USDT", "BTC", "BUSD", "BNB", "ETH"]
}

const getBinanceAllCoinExchangeInfo = async () => {
    const link = 'https://www.binance.com/api/v3/ticker/price'
    const response = await axios(link).catch(e => console.log('error'));
    
    if (!response) return [];

    return response.data
}

const getBinanceCoinExchangeInfo = async (from, to) => {
    const link = 'https://www.binance.com/api/v3/ticker/price'
    const response = await axios(`${ link }?symbol=${from}${to}`).catch(e => console.log('error'));
    
    if (!response) return null;

    return {
        price: +response.data.price
    }
}

const getBinanceP2POffers = async (action, coin, bank) => {
    const link = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search'
    const response = await axios.post(`${ link }`, {
        page: 1,
        rows: 10,
        payTypes: [bank],
        countries: [],
        publisherType: null,
        asset: coin,
        tradeType: action,
        fiat: "RUB",
        transAmount: `${ moneyAmount }`
    }).catch(e => console.log('error'));
    
    if (!response) return null;

    const result = response.data.data.filter(saler => (saler.advertiser.monthFinishRate > minSallerFinishRate && saler.advertiser.monthOrderCount > minOrderCount)).map(data => data.adv);
    if (result.length === 0) return null;

    

    return {
        tradeType: result[0].tradeType,
        asset: result[0].asset,
        bank: bank,
        price: +result[0].price,
        dynamicMaxSingleTransAmount: +result[0].dynamicMaxSingleTransAmount
    }
}

module.exports = {
    getCoins,
    getBanks,
    getBinanceP2POffers,
    getBinanceCoinExchangeInfo,
    getBinanceAllCoinExchangeInfo
}
