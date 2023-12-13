const mongoose = require('mongoose');

const { Schema } = mongoose;

const PinSchema = new Schema(
    {   
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        },
    }, {timestamps: true});

module.exports = mongoose.model("Pin", PinSchema); 