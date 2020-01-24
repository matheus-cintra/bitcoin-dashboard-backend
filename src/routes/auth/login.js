const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../users/model');

const router = express.Router();

router.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password } = req.body.form;
    const result = await User.findOne({ email });

    if (!result) {
      return res.status(400).json({ success: false, message: 'The user does not exists' });
    }

    User.comparePassword(password, result.password, (error, match) => {
      if (!match) {
        return res.status(400).json({ success: false, message: 'Username or password invalid' });
      }

      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
      result.password = undefined;

      res.status(200).send({ auth: true, token, user: result });
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'entrou no catch...' });
  }
});

router.get('/api/v1/logout', (req, res) => res.status(200).json({ success: true, token: null }));

module.exports = app => app.use(router);
