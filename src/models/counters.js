const mongoose = require('mongoose');

const counterIdschema = new mongoose.Schema({

    countId: {
           type: Number
    }
})

module.exports = mongoose.model("counterId", counterIdschema);