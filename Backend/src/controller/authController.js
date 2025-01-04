const User = require('../models/User');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production' ? true : false, 
    sameSite: 'Strict', 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
  };

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Set token in cookie instead of sending in response
    res.cookie('Token', token, cookieOptions);

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('Token', token, cookieOptions);

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add logout function
const logout = async (req, res) => {
  res.cookie('Token', '', { ...cookieOptions, maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  logout
};