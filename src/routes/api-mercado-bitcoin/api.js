/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const express = require('express');
const axios = require('axios');
const Cryptos = require('../api-mercado-bitcoin/model');

const URI_LOCAL = 'http://localhost:3000';
const URI_API = 'https://www.mercadobitcoin.net/api';

const router = express.Router();

router.get('/api/v1/get-bitcoin', async (req, res) => {
  const ticker = await axios.get(`${URI_API}/btc/ticker`);
  if (!ticker.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the crypto' });
  }

  const orderBook = await axios.get(`${URI_API}/btc/orderbook`);
  if (!orderBook.data) {
    return res.status(400).json({ success: false, error: 'Error fetching the orderbook' });
  }

  // console.log('orderBook...', orderBook);

  const trades = await axios.get(`${URI_API}/btc/trades`);
  if (!trades.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the trades' });
  }

  const actualYear = new Date().getFullYear();
  const actualMonth = new Date().getMonth();
  const actualDay = new Date().getDate();

  const fullData = [];

  const urls = [];

  for (let i = 2014; i <= actualYear; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i === actualYear && j > actualMonth + 1) break;
      for (let k = 1; k <= 31; k++) {
        if (i === actualYear && j === actualMonth + 1 && k > actualDay) break;
        urls.push(`${URI_API}/btc/day-summary/${i}/${j}/${k}`);
      }
    }
  }

  async function getBitcoin() {
    for (const url of urls) {
      try {
        const result = await axios.get(url);
        fullData.push(result.data);
      } catch (err) {
        continue;
      }
      console.warn('Migrado... ', url);
    }
  }

  await getBitcoin();

  const crypto = {
    crypto: 'BTC',
    cryptoName: 'Bitcoin',
    ticker: ticker.data.ticker,
  };

  const data = await Cryptos.findOneAndUpdate(
    { crypto: 'BTC' },
    {
      // $set: {
      crypto: crypto.crypto,
      cryptoName: crypto.cryptoName,
      ticker: {
        high: ticker.data.ticker.high,
        low: ticker.data.ticker.low,
        vol: ticker.data.ticker.vol,
        last: ticker.data.ticker.last,
        buy: ticker.data.ticker.buy,
        sell: ticker.data.ticker.sell,
        date: ticker.data.ticker.date,
      },
      orderBook: {
        asks: [],
        bids: [],
      },
      trades: [],
      // },
    },
    { upsert: true, returnNewDocument: true },
  );

  if (!data) {
    return res.status(400).json({ success: false, error: 'Cannot save info in mongoDB' });
  }
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  const result = Cryptos.update({ _id: id }, { $set: { orderBook: orderBook.data } }, dt => dt);
  data.workBook = result;
  // console.log('tradesData > ', trades);

  const tradeData = trades.data.map(x => ({
    tid: x.tid,
    date: x.date,
    movement: x.type,
    price: x.price,
    amount: x.amount,
  }));

  tradeData.forEach((x) => {
    const tradeResult = Cryptos.updateOne({ _id: id }, { $addToSet: { trades: x } }, dt => dt);
  });

  fullData.forEach((x) => {
    const dataResult = Cryptos.updateOne({ _id: id }, { $addToSet: { intraDay: x } }, dt => dt);
  });

  const finalResult = await Cryptos.findById({ _id: id });

  res.status(200).json({ success: true, finalResult });
});

router.get('/api/v1/get-litecoin', async (req, res) => {
  const ticker = await axios.get(`${URI_API}/ltc/ticker`);
  if (!ticker.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the crypto' });
  }

  const orderBook = await axios.get(`${URI_API}/ltc/orderbook`);
  if (!orderBook.data) {
    return res.status(400).json({ success: false, error: 'Error fetching the orderbook' });
  }

  // console.log('orderBook...', orderBook);

  const trades = await axios.get(`${URI_API}/ltc/trades`);
  if (!trades.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the trades' });
  }

  const actualYear = new Date().getFullYear();
  const actualMonth = new Date().getMonth();
  const actualDay = new Date().getDate();

  const fullData = [];

  const urls = [];

  for (let i = 2014; i <= actualYear; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i === actualYear && j > actualMonth + 1) break;
      for (let k = 1; k <= 31; k++) {
        if (i === actualYear && j === actualMonth + 1 && k >= actualDay) break;
        urls.push(`${URI_API}/ltc/day-summary/${i}/${j}/${k}`);
      }
    }
  }

  async function getLitecoin() {
    for (const url of urls) {
      try {
        const result = await axios.get(url);
        fullData.push(result.data);
      } catch (err) {
        continue;
      }
      console.warn('URL >>  ', url);
    }
  }

  await getLitecoin();

  const crypto = {
    crypto: 'LTC',
    cryptoName: 'Litecoin',
    ticker: ticker.data.ticker,
  };

  const data = await Cryptos.findOneAndUpdate(
    { crypto: 'LTC' },
    {
      // $set: {
      crypto: crypto.crypto,
      cryptoName: crypto.cryptoName,
      ticker: {
        high: ticker.data.ticker.high,
        low: ticker.data.ticker.low,
        vol: ticker.data.ticker.vol,
        last: ticker.data.ticker.last,
        buy: ticker.data.ticker.buy,
        sell: ticker.data.ticker.sell,
        date: ticker.data.ticker.date,
      },
      orderBook: {
        asks: [],
        bids: [],
      },
      trades: [],
      intraDay: [],
      // },
    },
    { upsert: true, returnNewDocument: true },
  );

  if (!data) {
    return res.status(400).json({ success: false, error: 'Cannot save info in mongoDB' });
  }
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  const result = Cryptos.update({ _id: id }, { $set: { orderBook: orderBook.data } }, dt => dt);
  data.workBook = result;
  // console.log('tradesData > ', trades);

  const tradeData = trades.data.map(x => ({
    tid: x.tid,
    date: x.date,
    movement: x.type,
    price: x.price,
    amount: x.amount,
  }));

  tradeData.forEach((x) => {
    const tradeResult = Cryptos.updateOne({ _id: id }, { $addToSet: { trades: x } }, dt => dt);
  });

  fullData.forEach((x) => {
    const dataResult = Cryptos.updateOne({ _id: id }, { $addToSet: { intraDay: x } }, dt => dt);
  });

  const finalResult = await Cryptos.findById({ _id: id });

  res.status(200).json({ success: true, finalResult });
});

router.get('/api/v1/get-bcash', async (req, res) => {
  const ticker = await axios.get(`${URI_API}/bch/ticker`);
  if (!ticker.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the crypto' });
  }

  const orderBook = await axios.get(`${URI_API}/bch/orderbook`);
  if (!orderBook.data) {
    return res.status(400).json({ success: false, error: 'Error fetching the orderbook' });
  }

  // console.log('orderBook...', orderBook);

  const trades = await axios.get(`${URI_API}/bch/trades`);
  if (!trades.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the trades' });
  }

  const actualYear = new Date().getFullYear();
  const actualMonth = new Date().getMonth();
  const actualDay = new Date().getDate();

  const fullData = [];

  const urls = [];

  for (let i = 2014; i <= actualYear; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i === actualYear && j > actualMonth + 1) break;
      for (let k = 1; k <= 31; k++) {
        if (i === actualYear && j === actualMonth + 1 && k >= actualDay) break;
        console.log('URL: ', `${URI_API}/bch/day-summary/${i}/${j}/${k}`);
        urls.push(`${URI_API}/bch/day-summary/${i}/${j}/${k}`);
      }
    }
  }

  async function getBcash() {
    for (const url of urls) {
      try {
        // console.log('URL ANTES > ', url);
        const result = await axios.get(url);
        fullData.push(result.data);
      } catch (err) {
        continue;
      }
      console.warn('Migrado... ', url);
    }
  }

  await getBcash();

  const crypto = {
    crypto: 'BCH',
    cryptoName: 'BCash',
    ticker: ticker.data.ticker,
  };

  const data = await Cryptos.findOneAndUpdate(
    { crypto: 'BCH' },
    {
      // $set: {
      crypto: crypto.crypto,
      cryptoName: crypto.cryptoName,
      ticker: {
        high: ticker.data.ticker.high,
        low: ticker.data.ticker.low,
        vol: ticker.data.ticker.vol,
        last: ticker.data.ticker.last,
        buy: ticker.data.ticker.buy,
        sell: ticker.data.ticker.sell,
        date: ticker.data.ticker.date,
      },
      orderBook: {
        asks: [],
        bids: [],
      },
      trades: [],
      intraDay: [],
      // },
    },
    { upsert: true, returnNewDocument: true },
  );

  if (!data) {
    return res.status(400).json({ success: false, error: 'Cannot save info in mongoDB' });
  }
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  const result = Cryptos.update({ _id: id }, { $set: { orderBook: orderBook.data } }, dt => dt);
  data.workBook = result;
  // console.log('tradesData > ', trades);

  const tradeData = trades.data.map(x => ({
    tid: x.tid,
    date: x.date,
    movement: x.type,
    price: x.price,
    amount: x.amount,
  }));

  tradeData.forEach((x) => {
    const tradeResult = Cryptos.updateOne({ _id: id }, { $addToSet: { trades: x } }, dt => dt);
  });

  fullData.forEach((x) => {
    console.warn('vai salvar isso aqui... ', x);
    const dataResult = Cryptos.updateOne({ _id: id }, { $addToSet: { intraDay: x } }, dt => dt);
  });

  const finalResult = await Cryptos.findById({ _id: id });

  res.status(200).json({ success: true, finalResult });
});

router.get('/api/v1/get-ripple', async (req, res) => {
  const ticker = await axios.get(`${URI_API}/xrp/ticker`);
  if (!ticker.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the crypto' });
  }

  const orderBook = await axios.get(`${URI_API}/xrp/orderbook`);
  if (!orderBook.data) {
    return res.status(400).json({ success: false, error: 'Error fetching the orderbook' });
  }

  // console.log('orderBook...', orderBook);

  const trades = await axios.get(`${URI_API}/xrp/trades`);
  if (!trades.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the trades' });
  }

  const actualYear = new Date().getFullYear();
  const actualMonth = new Date().getMonth();
  const actualDay = new Date().getDate();

  const fullData = [];

  const urls = [];

  for (let i = 2014; i <= actualYear; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i === actualYear && j > actualMonth + 1) break;
      for (let k = 1; k <= 31; k++) {
        if (i === actualYear && j === actualMonth + 1 && k >= actualDay) break;
        urls.push(`${URI_API}/xrp/day-summary/${i}/${j}/${k}`);
      }
    }
  }

  async function getRipple() {
    for (const url of urls) {
      try {
        const result = await axios.get(url);
        fullData.push(result.data);
      } catch (err) {
        continue;
      }
      console.warn('Migrado... ', url);
    }
  }

  await getRipple();

  const crypto = {
    crypto: 'XRP',
    cryptoName: 'XRP (Ripple)',
    ticker: ticker.data.ticker,
  };

  const data = await Cryptos.findOneAndUpdate(
    { crypto: 'XRP' },
    {
      // $set: {
      crypto: crypto.crypto,
      cryptoName: crypto.cryptoName,
      ticker: {
        high: ticker.data.ticker.high,
        low: ticker.data.ticker.low,
        vol: ticker.data.ticker.vol,
        last: ticker.data.ticker.last,
        buy: ticker.data.ticker.buy,
        sell: ticker.data.ticker.sell,
        date: ticker.data.ticker.date,
      },
      orderBook: {
        asks: [],
        bids: [],
      },
      trades: [],
      intraday: [],
      // },
    },
    { upsert: true, returnNewDocument: true },
  );

  if (!data) {
    return res.status(400).json({ success: false, error: 'Cannot save info in mongoDB' });
  }
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  const result = Cryptos.update({ _id: id }, { $set: { orderBook: orderBook.data } }, dt => dt);
  data.workBook = result;
  // console.log('tradesData > ', trades);

  const tradeData = trades.data.map(x => ({
    tid: x.tid,
    date: x.date,
    movement: x.type,
    price: x.price,
    amount: x.amount,
  }));

  tradeData.forEach((x) => {
    const tradeResult = Cryptos.updateOne({ _id: id }, { $addToSet: { trades: x } }, dt => dt);
  });

  fullData.forEach((x) => {
    const dataResult = Cryptos.updateOne({ _id: id }, { $addToSet: { intraDay: x } }, dt => dt);
  });

  const finalResult = await Cryptos.findById({ _id: id });

  res.status(200).json({ success: true, finalResult });
});

router.get('/api/v1/get-ethereum', async (req, res) => {
  const ticker = await axios.get(`${URI_API}/eth/ticker`);
  if (!ticker.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the crypto' });
  }

  const orderBook = await axios.get(`${URI_API}/eth/orderbook`);
  if (!orderBook.data) {
    return res.status(400).json({ success: false, error: 'Error fetching the orderbook' });
  }

  // console.log('orderBook...', orderBook);

  const trades = await axios.get(`${URI_API}/eth/trades`);
  if (!trades.data) {
    return res.status(400).json({ success: false, error: 'Error searching for the trades' });
  }

  const actualYear = new Date().getFullYear();
  const actualMonth = new Date().getMonth();
  const actualDay = new Date().getDate();

  const fullData = [];

  const urls = [];

  for (let i = 2018; i <= actualYear; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i === actualYear && j > actualMonth + 1) break;
      for (let k = 1; k <= 31; k++) {
        if (i === actualYear && j === actualMonth + 1 && k >= actualDay) break;
        urls.push(`${URI_API}/eth/day-summary/${i}/${j}/${k}`);
      }
    }
  }

  async function getEthereum() {
    for (const url of urls) {
      try {
        console.log('Bateu nesse endpoint > ', url);
        const result = await axios.get(url);
        fullData.push(result.data);
      } catch (err) {
        continue;
      }
      console.warn('Migrado... ', url);
    }
  }

  await getEthereum();

  const crypto = {
    crypto: 'ETH',
    cryptoName: 'Ethereum',
    ticker: ticker.data.ticker,
  };

  const data = await Cryptos.findOneAndUpdate(
    { crypto: 'ETH' },
    {
      // $set: {
      crypto: crypto.crypto,
      cryptoName: crypto.cryptoName,
      ticker: {
        high: ticker.data.ticker.high,
        low: ticker.data.ticker.low,
        vol: ticker.data.ticker.vol,
        last: ticker.data.ticker.last,
        buy: ticker.data.ticker.buy,
        sell: ticker.data.ticker.sell,
        date: ticker.data.ticker.date,
      },
      orderBook: {
        asks: [],
        bids: [],
      },
      trades: [],
      intraDat: [],
      // },
    },
    { upsert: true, returnNewDocument: true },
  );

  if (!data) {
    return res.status(400).json({ success: false, error: 'Cannot save info in mongoDB' });
  }
  // eslint-disable-next-line no-underscore-dangle
  const id = data._id;
  const result = Cryptos.update({ _id: id }, { $set: { orderBook: orderBook.data } }, dt => dt);
  data.workBook = result;
  // console.log('tradesData > ', trades);

  const tradeData = trades.data.map(x => ({
    tid: x.tid,
    date: x.date,
    movement: x.type,
    price: x.price,
    amount: x.amount,
  }));

  tradeData.forEach((x) => {
    const tradeResult = Cryptos.updateOne({ _id: id }, { $addToSet: { trades: x } }, dt => dt);
  });

  fullData.forEach((x) => {
    const dataResult = Cryptos.updateOne({ _id: id }, { $addToSet: { intraDay: x } }, dt => dt);
  });

  const finalResult = await Cryptos.findById({ _id: id });

  res.status(200).json({ success: true, finalResult });
});

module.exports = app => app.use(router);
