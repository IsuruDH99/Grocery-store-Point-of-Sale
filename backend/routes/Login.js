const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models'); // Import models correctly (assuming Sequelize setup)
const Login = db.Login; // Access the Login model

// ✅ Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, jobrole } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await Login.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ Create new user
    await Login.create({
      email,
      password: hashedPassword,
      jobrole,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// 🔑 Login user
router.post('/logindata', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await Login.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 🔒 Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ✅ Successful login
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        jobrole: user.jobrole,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 🔄 Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 🔍 Find user by email
    const user = await Login.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔄 Update password
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;