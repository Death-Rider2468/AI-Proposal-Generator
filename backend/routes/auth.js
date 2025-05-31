const express = require('express');
const router = express.Router();
const { admin } = require('../firebase');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login (returns Firebase custom token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // For demo: use Firebase Auth REST API or handle on frontend
  res.status(501).json({ error: 'Login handled on frontend with Firebase SDK.' });
});

module.exports = router;