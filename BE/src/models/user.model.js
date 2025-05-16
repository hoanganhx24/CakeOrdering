const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoosePaginate = require('mongoose-paginate-v2');
dotenv.config();

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '10h',
        }
    );
};

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
