const axios = require('axios');

//RUB -> BTC -> BNB -> RUB
const minSalerFinishRate = 0.90;
const minOrderCount = 5;

const getBinanceCoinExchangeInfo = async (from, to) => {
    const link = 'https://www.binance.com/api/v3/ticker/price'
    const response = await axios(`${ link }?symbol=${from}${to}`).catch(e => console.log('error'));
    
    if (!response) return;

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
        fiat: "RUB"
    }).catch(e => console.log('error'));
    
    if (!response) return;

    const result = response.data.data.filter(saler => (saler.advertiser.monthFinishRate > minSalerFinishRate && saler.advertiser.monthOrderCount > minOrderCount)).map(data => data.adv);

    return {
        price: +result[0].price,
        dynamicMaxSingleTransAmount: +result[0].dynamicMaxSingleTransAmount
    }
}

const main = async () => {

    const data1 = await getBinanceP2POffers("SELL", "BTC", "RosBank"); // Tinkoff YandexMoney
    const data2 = await getBinanceCoinExchangeInfo("ETH", "BTC");
    const data3 = await getBinanceP2POffers("BUY", "ETH", "RosBank"); // RosBank QIWI

    console.log(data1);
    console.log(data2);
    console.log(data3);

    const a = 100000; // RUB
    const b = a / data1.price; // RUB в BTC
    const c = b / data2.price; // BTC в BNB
    const d = c * data3.price;

    console.log(d);
}   

main();