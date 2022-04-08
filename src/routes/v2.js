const express = require('express');
const { validateMiddleware, authMiddleware } = require('../middleware');

const { registerSupplier } = require('./handlers/suppliers/supplier.register.handler');

const router = express.Router();

router.post('/suppliers', validateMiddleware, registerSupplier);
router.post('/buyers/:buyerId/suppliers', validateMiddleware, authMiddleware, registerSupplier);

module.exports = router;
