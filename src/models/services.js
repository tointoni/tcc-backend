const mongoose = require('mongoose');
const PointSchema = require("./utils/PointSchema");

const ServicestSchema = new mongoose.Schema({

    order: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: PointSchema,
        index: "2dsphere"
    },
    Data_services: {
        type: Date,
        default: Date.now
    },
    UserClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    userName: {
        type: String,
        required: true
    },
    userPhone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    amountPayable: {
        type: Number
    }
});

module.exports = mongoose.model("services", ServicestSchema);