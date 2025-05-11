const express = require('express');
const router = express.Router();
const { getBalance } = require('../controllers/playerController');

router.get('/balance', getBalance);

module.exports = router;