const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stockName: {
        type: String,
        require:true
    },
    Price: {
        type: Number,
        require:true
    }
});

const stockModel = mongoose.model('Stock', stockSchema);

module.exports = stockModel;
