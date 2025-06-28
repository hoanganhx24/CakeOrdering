const asyncHandler = require('express-async-handler')
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay')
const Cart = require('../models/cart.model');
const crypto = require('crypto');

module.exports.createPayment = asyncHandler(async (req, res) => {
    const { amount, orderId } = req.body;

    const generateTxnRef = () => {
        return crypto.randomBytes(8).toString('hex'); // 16 ký tự hex
    };
    const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_HASH_SECRET,
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpayUrl = await vnpay.buildPaymentUrl({
        vnp_Amount: amount * 100, //
        vnp_IpAddr: '127.0.0.1',
        vnp_TxnRef: generateTxnRef(), // Mã giao dịch duy nhất
        vnp_OrderInfo: `${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `${process.env.VNPAY_RETURN_URL}`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    });

    return res.status(201).json(vnpayUrl);
});



