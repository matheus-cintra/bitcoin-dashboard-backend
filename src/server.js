require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const mongoose = require('../config/database');

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ bodyParser: true, limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
mongoose();

require('./routes/auth/tokens/jwtVerify');
require('./routes/auth/login')(app);
require('./routes/btcApi')(app);
require('./routes/users/api')(app);
require('./routes/api-mercado-bitcoin/api')(app);

app.get('/', (req, res) =>
  res.status(200).json({ success: true, message: 'Welcome to Bitcoin Dashboard App' })
);

app.listen(3000, () => {
  console.warn('Server is running on port 3000');
});
