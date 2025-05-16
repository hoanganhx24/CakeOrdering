const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const {protect, customerMiddleware} = require('../middlewares/auth.middleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.put('/changePassword',protect, controller.changePassword);
router.put('/updateUser',protect, controller.updateUser);
router.put('/logout', controller.logout);

module.exports = router;