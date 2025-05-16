const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {userValid} = require('../validation/user.validation');


// [POST] /api/auth/register
module.exports.register = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;

    const { error } = userValid.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const userExists = await User.findOne({$or: [{ email }, { username }] });
    if (userExists) {
        res.status(400);
        throw new Error('User da ton tai');
    }

    let role = 'customer';

    const user = new User({
        name,
        email,
        username,
        password,
        role
    });

    if (user) {
        const createUser = await user.save();
        const _token = createUser.getSignedToken();
        res.status(201).cookie('token', _token).json({
            user: {
                _id: createUser._id,
                name: createUser.name,
                email: createUser.email,
                username: createUser.username,
                role: createUser.role
            },
            token: _token
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// [POST] /api/auth/login
module.exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        throw new Error('Please provide username and password');
    }

    const user = await User.findOne({ username: username});
    const _token = user.getSignedToken();
    if (user && (await user.matchPassword(password))) {
        res.status(200).cookie('token', _token).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token: _token
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid username or password');
    }

});

// [PATCH]
module.exports.changePassword = asyncHandler(async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || !username) {
        res.status(400);
        throw new Error('Please provide old password and new password');
    }

    const user = await User.findOne({ username: username });
    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            message: 'Password changed successfully'
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid old password or username');
    }
});

// [PUT] /api/auth/update
module.exports.updateUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user._id;

    if (!name || !email) {
        res.status(400);
        throw new Error('Please provide name, email');
    }
    const user = await User.findById(userId);

    const emailExists = await User.findOne({ email: email });
    if (emailExists && emailExists._id.toString() !== userId.toString()) {
        res.status(400);
        throw new Error('Email already exists');
    }
    if (user) {
        user.name = name;
        user.email = email;
        await user.save();
        res.status(200).json({
            message: 'User updated successfully'
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

// [PUT] /api/auth/logout
module.exports.logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({
        success: true,
        data: {}
    });
});