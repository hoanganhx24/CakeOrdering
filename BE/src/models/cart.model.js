const { version } = require('joi');
const mongoose = require('mongoose');

const detailProduct = mongoose.Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        photo: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        qty: {
            type: Number,
            require: true,
        }
    }
);

const cartSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        item: [detailProduct],
        totalPrice: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true, 
        versionKey: false
    }
);

cartSchema.pre('save', function (next) {
    this.totalPrice = this.item.reduce((sum, item) => sum + (item.price * item.qty) , 0);
    next();
})

const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;