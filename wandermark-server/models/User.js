const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            min: 4,
            max: 30,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 320,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 8
        },
    }, {timestamps: true});

module.exports = mongoose.model("User", UserSchema); 