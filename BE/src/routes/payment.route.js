const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const {protect, customerMiddleware} = require('../middlewares/auth.middleware');

router.post('/', protect, customerMiddleware, controller.createPayment);

module.exports = router;