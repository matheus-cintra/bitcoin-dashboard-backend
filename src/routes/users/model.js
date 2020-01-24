const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
  },
});

async function generateHash(next) {
  try {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
  } catch (err) {
    return next(err);
  }
  return next();
}

userSchema.statics.comparePassword = function(userPassword, hash, next) {
  bcryptjs.compare(userPassword, hash, (err, match) => {
    if (err) return next(err);
    next(null, match);
  });
};

userSchema.pre('save', generateHash);

const User = mongoose.model('Users', userSchema, 'core_users');

module.exports = User;
