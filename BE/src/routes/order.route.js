const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { protect, adminMiddleware } = require('../middlewares/auth.middleware');

router.post('/', protect, controller.createOrder);
router.get('/', protect, controller.getOrder);
router.get('/all', protect, adminMiddleware, controller.getAllOrder);
router.get('/newOrders', protect, adminMiddleware, controller.getNewOrder);
router.patch('/:id', protect, adminMiddleware, controller.updateStatusOrder);

module.exports = router;
