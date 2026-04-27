const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = "my_super_secret_key_123";
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;