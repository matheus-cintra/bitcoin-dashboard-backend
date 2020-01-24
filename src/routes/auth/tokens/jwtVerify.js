const jwt = require('jsonwebtoken');

function validateJwt(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ success: false, auth: false, message: 'no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, auth: false, message: 'Failed to authenticate the token' });
    }

    console.log('decoded...', decoded);

    req.userId = decoded.id;
    next();
  });
}

module.exports = { validateJwt };
