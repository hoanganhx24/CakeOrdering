const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const { updateUserValid } = require('../validation/user.validation');


// [GET] /api/user/getUser?
module.exports.getUser = asyncHandler(async (req, res) => {
    const { _role, _search, _page = 1, _limit = 10 } = req.query;
    const query = {};
    const options = {};

    options.page = parseInt(_page);
    options.limit = parseInt(_limit);

    console.log(_role);
    if (_role) {
        query.role = _role;
    }

    if(_search) {
        query.$or = [
        { name: { $regex: _search, $options: 'i' } },
        { email: { $regex: _search, $options: 'i' } },
        { username: { $regex: _search, $options: 'i' } }
    ];
    }
    const users = await User.paginate(query, options);

    if (users.docs.length) {
        res.status(200).json(users);
    }
    else {
        res.status(404);
        throw new Error('Users not found');
    }
});

// [GET] /api/user/profile
module.exports.profile = asyncHandler(async (req, res) => {
    const idUser = req.user._id;
    const user = await User.findById(idUser).select('-password -__v');
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
})
// [PATCH] api/user/profile
module.exports.updateUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {name} = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { error } = updateUserValid.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    user.name = name || user.name;
    const updatedUser = await user.save();
    if (updatedUser) {
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// [DELETE] /api/user/:id
module.exports.deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = await User.findByIdAndDelete(id);
    if (user) {
        res.status(200).json({message: 'User deleted successfully'});
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});



