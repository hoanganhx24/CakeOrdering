const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed");
    }
}
