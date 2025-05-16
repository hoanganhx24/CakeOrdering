const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { protect, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/',protect, adminMiddleware, controller.getUser);
router.get('/profile', protect, controller.profile);
router.patch('/profile', protect, controller.updateUser);
router.delete('/:id', protect, adminMiddleware, controller.deleteUser);

module.exports = router;