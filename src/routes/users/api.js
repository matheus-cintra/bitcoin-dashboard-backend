const express = require('express');
const User = require('./model');

const routerUser = express.Router();

routerUser.post('/api/v1/getUser', async (req, res) => {
  console.log('req...', req.body);
  try {
    const _id = req.body.data._id;
    if (!_id) {
      return res.status(401).json({
        success: false,
        data: {
          message: 'invalid id',
        },
      });
    }

    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(401).json({
        success: false,
        data: {
          message: 'User not found',
        },
      });
    }

    user.password = undefined;
    user._id = null;

    res.status(200).send({ success: true, user });
  } catch (err) {
    return res.status(403).json({ success: false, data: err });
  }
});

routerUser.post('/api/v1/user-registration', async (req, res) => {
  try {
    const { email } = req.body.form;
    if (!email) {
      return res.status(401).json({
        success: false,
        data: {
          message: 'Email field is required',
        },
      });
    }

    await User.findOne({ email }, (e, dt) => {
      if (dt) {
        return res.status(400).json({
          success: false,
          data: {
            message: 'This email is already in use',
          },
        });
      }
    });

    const result = await User.create({ ...req.body.form });
    result.password = undefined;
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log('entrou no catch...', err);
    return res.status(403).json({ success: false, data: err });
  }
});

module.exports = app => app.use(routerUser);
