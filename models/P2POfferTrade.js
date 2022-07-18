const mongoose = require('mongoose');
const { Schema } = mongoose;

const P2POfferTradeSchema = new Schema({
    tradeType: String,
    asset: String,
    bank: String,
    price: Number,
    dynamicMaxSingleTransAmount: Number,
}, {timestamps: true});

module.exports =  mongoose.model('P2POfferTrade', P2POfferTradeSchema);