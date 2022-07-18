const mongoose = require('mongoose');
const { Schema } = mongoose;

const CoinPairSchema = new Schema({
    symbol: String,
    price: Number
}, {timestamps: true});

module.exports =  mongoose.model('CoinPair', CoinPairSchema);