const mongoose = require('mongoose');

const URI = 'mongodb://localhost/bitcoin-dashboard';

module.exports = () => {
  mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Database running on URL ${URI}`))
    .catch((err) => {
      console.log(`Error connecting to ${URI}... See error below: `, err);
    });
};
