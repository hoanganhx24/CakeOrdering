const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');


// [POST] /api/order
module.exports.createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { deliveryDate, deliveryTime, phone, address, note } = req.body;

    if (!deliveryDate || !deliveryTime || !phone || !address) {
        return res.status(400).json({ message: 'Khong du thong tin van chuyen' });
    }

    const cart = await Cart.findOne({ customerId: userId });
    if (!cart || cart.item.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItem = cart.item.map(item => ({
        productId: item.productId,
        name: item.name,
        photo: item.photo,
        price: item.price,
        qty: item.qty,
    }))

    const order = new Order({
        customerId: userId,
        status: 'pending',
        item: orderItem,
        totalPrice: cart.totalPrice,
        deliveryInfo: {
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            phone: phone,
            address: address,
            note: note
        }
    });

    await order.save();
    cart.item = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
})


// [GET] /api/order
module.exports.getOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { startDate, endDate, status, page, limit } = req.query;
    const query = {
        customerId: userId
    };
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 5,
        sort: {
            createdAt: -1
        }
    };
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }
    if (status && status !== 'ALL') {
        query.status = status;
    }
    const orders = await Order.paginate(query, options);
    res.status(200).json(orders);
});

// [GET] /api/order/all
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    const { _page, _limit, _status, _startDate, _endDate, _search } = req.query;

    const query = {};
    const options = {};

    if (_status && _status !== 'all') {
        query.status = _status;
    }
    if (_startDate && _endDate) {
        query.createdAt = {
            $gte: new Date(_startDate),
            $lte: new Date(_endDate)
        }
    };
    let customerIds = [];
    if (_search) {
        const searchRegex = { $regex: _search, $options: 'i' };
        const customers = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        }).select('_id');
        customerIds = customers.map(c => c._id);
    }
    if (customerIds.length > 0) {
        query.customerId = { $in: customerIds };
    } else if (_search) {
        // Nếu có từ khóa nhưng không tìm được khách hàng, tránh trả về tất cả đơn
        query.customerId = { $in: [] };
    }

    options.page = parseInt(_page) || 1;
    options.limit = parseInt(_limit) || 10;

    options.sort = {
        createdAt: -1
    };

    options.populate = {
        path: 'customerId',
        select: 'name email'
    };

    const orders = await Order.paginate(query, options);


    // if (!orders || orders.docs.length === 0) {
    //     return res.status(400).json({ message: 'No orders found' });
    // }

    res.status(200).json(orders);
})

module.exports.getNewOrder = asyncHandler(async (req, res) => {
    const { _page, _limit, _status, _startDate, _endDate, _search } = req.query;

    const query = {};
    const options = {};

    if (!_status || _status === 'all') {
        // Mặc định lấy tất cả status trừ 'cancelled'
        query.status = { $nin: ['cancelled', 'delivered'] };
    } else {
        // Nếu có status cụ thể thì lọc theo
        query.status = _status;
    }
    if (_startDate && _endDate) {
        query.createdAt = {
            $gte: new Date(_startDate),
            $lte: new Date(_endDate)
        }
    };
    let customerIds = [];
    if (_search) {
        const searchRegex = { $regex: _search, $options: 'i' };
        const customers = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        }).select('_id');
        customerIds = customers.map(c => c._id);
    }
    if (customerIds.length > 0) {
        query.customerId = { $in: customerIds };
    } else if (_search) {
        // Nếu có từ khóa nhưng không tìm được khách hàng, tránh trả về tất cả đơn
        query.customerId = { $in: [] };
    }

    options.page = parseInt(_page) || 1;
    options.limit = parseInt(_limit) || 10;

    options.sort = {
        createdAt: -1
    };

    options.populate = {
        path: 'customerId',
        select: 'name email'
    };

    const orders = await Order.paginate(query, options);


    // if (!orders || orders.docs.length === 0) {
    //     return res.status(400).json({ message: 'No orders found' });
    // }

    res.status(200).json(orders);
})

// [PATCH] /api/order/:id
module.exports.updateStatusOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const STATUS_FLOW = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['shipping', 'cancelled'],
        shipping: ['delivered', 'cancelled'],
        delivered: [],
        cancelled: []
    };

    if (!STATUS_FLOW[order.status].includes(status)) {
        return res.status(400).json({ error: 'Chuyển trạng thái không hợp lệ' });
    }

    order.status = status;
    await order.save();
    res.status(200).json(order);
});