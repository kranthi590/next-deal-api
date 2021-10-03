const express = require('express');

const router = express.Router();

router.get('/details/:userId', (req, res) => {
  res.json({});
});

module.exports = router;
