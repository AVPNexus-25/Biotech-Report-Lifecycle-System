const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });
  

  res.json({
    token: generateToken(user),
    user
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      user
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

