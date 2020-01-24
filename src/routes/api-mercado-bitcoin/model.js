const mongoose = require('mongoose');

const ticker = {
  high: String,
  low: String,
  vol: String,
  last: String,
  buy: String,
  sell: String,
  date: Date,
};

const asks = [String];
const bids = [String];

const orderBook = {
  asks: [asks],
  bids: [bids],
};

const trades = {
  tid: Number,
  date: Date,
  movement: String,
  price: Number,
  amount: Number,
};

const intraDay = {
  date: String,
  opening: Number,
  closing: Number,
  lowest: Number,
  highest: Number,
  volume: Number,
  quantity: Number,
  amount: Number,
  avg_price: Number,
};

const CryptoSchema = new mongoose.Schema(
  {
    crypto: String,
    cryptoName: String,
    ticker,
    orderBook,
    trades: [trades],
    intraDay: [intraDay],
  },
  { versionKey: false },
);

const Cryptos = mongoose.model('Cryptos', CryptoSchema, 'core_cryptos');

module.exports = Cryptos;
