const express = require('express');
const { getSearchSuggestions } = require('../services/aiService');

const router = express.Router();

router.post('/recommendations', async (req, res) => {
  try {
    const { query } = req.body;
    const suggestions = await getSearchSuggestions(query);
    res.json({ recommendations: suggestions });
  } catch (error) {
    console.error('AI recommendations route error:', error);
    res.status(500).json({ message: 'Failed to get AI recommendations' });
  }
});

module.exports = router;