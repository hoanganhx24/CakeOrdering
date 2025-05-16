const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { protect, adminMiddleware } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/upload.middleware');

router.get('/all', controller.getAllMenu);
router.get('/', controller.getMenu);
router.get('/:id', controller.getProductById);
router.post('/', protect, adminMiddleware, upload.single('image'), controller.createProduct);
router.put('/:id', protect, adminMiddleware, upload.single('image'), controller.updateProduct);
router.delete('/:id', protect, adminMiddleware, controller.deleteProduct);

module.exports = router;

