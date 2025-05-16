const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const {productValid} = require('../validation/product.validation');
const cloudinary = require('../config/cloudinary');


// [GET] /api/menu?
module.exports.getMenu = asyncHandler(async (req, res) => {
    console.log(req.query);
    const { _category, _page = 1, _limit = 10, _sort, _order, _search } = req.query;

    const query = {};
    const options = {};

    if (_category && _category !== 'ALL') {
        query.category = _category;
    }

    if (_search) {
        query.name = { $regex: _search, $options: 'i' };
    }

    options.page = parseInt(_page);
    options.limit = parseInt(_limit);

    if (_sort) {
        options.sort = {
            [_sort]: _order === 'asc' ? 1 : -1
        };
    }

    const products = await Product.paginate(query, options);

    if (products.docs.length) {
        res.status(200).json(products);
    }
    else {
        res.status(404);
        throw new Error('Products not found');
    }
});

// [GET] /api/menu/:id

module.exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
        res.status(200).json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
})

// [GET] /api/menu/all
module.exports.getAllMenu = asyncHandler(async (req, res) => {
    // const options = {};
    // options.page = parseInt(_page);
    // options.limit = parseInt(_limit);
    const products = await Product.paginate();
    if (products.length) {
        res.status(200).json(products);
    }
    else {
        res.status(404);
        throw new Error('Products not found');
    }
});

// [POST]

module.exports.createProduct = asyncHandler(async (req, res) => {
    const { name, price, category, description } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image');
    }


    const { error } = productValid.validate(req.body);

    const imageId = req.file?.path?.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/)?.[1];


    if (error) {
        await cloudinary.uploader.destroy(imageId);
        console.log('Error', error.details[0].message);
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const Category = ['BIRTHDAY CAKE', 'PASTRY', 'BREAD', 'COOKIE'];
    if (!Category.includes(category.toUpperCase())) {
        await cloudinary.uploader.destroy(imageId);
        res.status(400);
        throw new Error('Category not exists');
    }


    // const categoryExist = await Product.findOne({ category: category.toUpperCase() });
    const productExist = await Product.findOne({ name: name });
    // if (!categoryExist) {
    //     await cloudinary.uploader.destroy(imageId);
    //     res.status(400);
    //     throw new Error('Category not exists');
    // }
    if (productExist) {
        await cloudinary.uploader.destroy(imageId);
        res.status(400);
        throw new Error('Product already exists');
    }
    const product = new Product({
        name,
        photo: req.file.path,
        description,
        price: parseInt(price),
        category

    })
    // console.log('Product', product);

    if (product) {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
    else {
        await cloudinary.uploader.destroy(imageId);
        res.status(400);
        throw new Error('Invalid product data');
    }
});

// [PUT] /api/menu/:id

module.exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    const { error } = productValid.validate(req.body);

    const imageId = req.file?.path?.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/)?.[1];

    if (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(imageId);
        }
        console.log('Error', error.details[0].message);
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const product = await Product.findById(id);

    if (product.name !== name) {
        const productExist = await Product.findOne({ name: name });
        if (productExist) {
            if (req.file) {
                await cloudinary.uploader.destroy(imageId);
            }
            res.status(400);
            throw new Error('Product already exists');
        }
    }
    if (product.category !== category) {
        const categoryExist = await Product.findOne({ category: category.toUpperCase() });
        if (!categoryExist) {
            if (req.file) {
                await cloudinary.uploader.destroy(imageId);
            }
            res.status(400);
            throw new Error('Category not exists');
        }
    }

    if (req.file) {
        const oldImageId = product.photo?.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/)?.[1];
        if (oldImageId) {
            await cloudinary.uploader.destroy(oldImageId);
        }
    }

    if (product) {
        product.name = name;
        product.photo = req.file?.path ? req.file.path : product.photo;
        product.description = description;
        product.price = parseInt(price);
        product.category = category.toUpperCase();

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// [DELETE] /api/menu/:id
module.exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
        await product.deleteOne();
        res.status(200).json({ message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }

});
