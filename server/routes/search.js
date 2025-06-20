const express = require('express');
const router = express.Router();
const User = require('../config/User'); // adjust if needed

router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
