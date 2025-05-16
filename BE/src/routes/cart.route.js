const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');
const {protect, customerMiddleware} = require('../middlewares/auth.middleware');

router.post('/:productId', protect, customerMiddleware, controller.addToCart);
router.get('/', protect, customerMiddleware, controller.getCart);
router.delete('/:productId', protect, customerMiddleware, controller.removeItem);
router.delete('/clearCart', protect, customerMiddleware, controller.clearCart);
router.patch('/:productId', protect, customerMiddleware, controller.updateCart);

module.exports = router;