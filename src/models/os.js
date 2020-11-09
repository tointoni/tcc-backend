const mongoose = require('mongoose');

const OsSchema = new mongoose.Schema({

    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    star: Number,
    data_os: Date,
    UserCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
    },
    UserServices: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    }

});

module.exports = mongoose.model("os", OsSchema);