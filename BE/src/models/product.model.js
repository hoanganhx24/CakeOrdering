const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
