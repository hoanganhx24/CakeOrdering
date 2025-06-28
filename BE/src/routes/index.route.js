const productRoutes = require('./product.route');
const authRoutes = require('./auth.route');
const cartRoutes = require('./cart.route');
const userRoutes = require('./user.route');
const orderRoutes = require('./order.route');
const paymentRoutes = require('./payment.route');

module.exports = (app) => {
    app.use('/api/menu', productRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/order', orderRoutes);
    app.use('/api/payment', paymentRoutes);
};