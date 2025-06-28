const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { protect, adminMiddleware, customerMiddleware } = require('../middlewares/auth.middleware');

router.post('/', protect, controller.createOrder);
router.get('/', protect, controller.getOrder);
router.get('/all', protect, adminMiddleware, controller.getAllOrder);
router.get('/newOrders', protect, adminMiddleware, controller.getNewOrder);
router.patch('/updateStatus/:id', protect, adminMiddleware, controller.updateStatusOrder);
router.patch('/updateSPay', protect, customerMiddleware, controller.updatePaymentStatus);

module.exports = router;
