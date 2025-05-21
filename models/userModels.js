const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: String,
    preferences: [String],
});


const User = mongoose.model('User', userSchema);

module.exports = User;