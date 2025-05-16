const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const asyncHandler = require('express-async-handler');

// [POST] /api/cart/:id
module.exports.addToCart = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    const { qty } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ customerId: userId });

    if (!cart) {
        cart = new Cart({ 
            customerId: userId, 
            item: [], 
            totalPrice: 0 
        });
    }

    const existingItemIndex = cart.item.findIndex(item => item.productId.toString() === productId.toString());

    if (existingItemIndex >= 0) {
        cart.item[existingItemIndex].qty += parseInt(qty);
    }
    else {
        cart.item.push({
            productId: product._id,
            name: product.name,
            photo: product.photo,
            price: product.price,
            qty: parseInt(qty)
        });
    }
    const newCart = await cart.save();
    res.status(201).json(newCart);
});

// [GET] /api/cart/getCart
module.exports.getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ customerId: userId});

    if (!cart) {
        res.status(200).json({
            item: [],
            totalPrice: 0
        })
    }
    else {
        res.status(200).json(cart);
    }
});

// [DELETE] /api/cart/:productId
module.exports.removeItem = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const cart = await Cart.findOne({ customerId: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.item = cart.item.filter(item => item.productId.toString() !== productId.toString());

    await cart.save();
    res.status(200).json(cart);
});

// [DELETE] /api/cart/clearCart
module.exports.clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Cart.findOneAndDelete({ customerId: userId });
    res.status(200).json({
        message: 'Cart cleared successfully'
    });
});

// [PATCH] /api/cart/:productId
module.exports.updateCart = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const { qty } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const cart = await Cart.findOne({ customerId: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const indexItem = cart.item.findIndex(item => item.productId.toString() === productId.toString());
    if (indexItem < 0) {
        res.status(404);
        throw new Error('Product not found in cart');
    }

    cart.item[indexItem].qty = parseInt(qty);

    if (cart.item[indexItem].qty <= 0) {
        cart.item.splice(indexItem, 1);
    }
    await cart.save();
    res.status(200).json(cart);
})
