const { types } = require('joi');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

const deliveryInfoSchema = new mongoose.Schema(
    {
        deliveryDate: {
            type: Date,
            required: true
        },
        deliveryTime: {
            type: String,
            required: true,
            enum: ['08:00-10:00', '10:00-12:00', '13:00-15:00', '15:00-17:00'],
            default: '8:00-10:00'
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    { _id: false }
);

const orderSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        status: {
            type: String,
            require: true,
        },
        item: [detailProduct],
        totalPrice: {
            type: Number,
            require: true,
        },
        deliveryInfo: {
            type: deliveryInfoSchema,
            require: true,
        },
        paymentStatus: {
            type: Number,
            enum: [0, 1],
            require: true,
            default: 0,
        },
        paymentMethod: {
            type: Number,
            enum: [0, 1],
            require: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

orderSchema.plugin(mongoosePaginate);


const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;