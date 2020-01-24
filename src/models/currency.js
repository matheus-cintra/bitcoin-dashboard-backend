const mongoose = require('mongoose');

const quote = {
  BRL: {
    price: Number,
    volume_24h: Number,
    percent_change_1h: Number,
    percent_change_24h: Number,
    percent_change_7d: Number,
    market_cap: Number,
    last_updated: Date,
  },
};

const platform = {
  name: String,
  symbol: String,
  slug: String,
  token_address: String,
};

const currencySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  slug: String,
  num_market_pais: Number,
  date_added: Date,
  tags: [String],
  max_supply: Number,
  circulating_supply: Number,
  total_supply: String,
  platform,
  cmc_rank: Number,
  last_updated: Date,
  quote,
});

const Currency = mongoose.model('Currencies', currencySchema, 'core_currencies');

module.exports = Currency;
