/* eslint-disable consistent-return */
const express = require('express');
const Currency = require('../models/currency');
const { validateJwt } = require('../routes/auth/tokens/jwtVerify');

const router = express.Router();

router.get('/api/v1/getCurrencies', async (req, res) => {
  try {
    await Currency.find({}, null, { limit: 50 }, (e, dt) => {
      if (e) return res.status(404).json({ success: false, data: e });
      return res.status(200).json({ success: true, data: dt });
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: `Error with request. ${err}` });
  }
});

router.post('/api/v1/postCurrencies', async (req, res) => {
  try {
    const { currencies } = req.body;
    const bulk = [];
    currencies.map(x => {
      bulk.push({ insertOne: { document: x } });
    });

    const result = await Currency.bulkWrite(bulk, { w: 1 });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(401).json({ success: false, data: err });
  }
});

router.get('/api/v1/validate', validateJwt, (req, res) => {
  console.log('req...', req.userId);
  return res.status(200).json({ success: true, userId: req.userId });
});

module.exports = app => app.use(router);
