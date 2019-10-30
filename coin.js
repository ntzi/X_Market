// Create the Schema (form) of the database saving the coin-pair of each platform combination.
// Next we get this schema and populate the 'time' and 'difference' for each pair.

var mongoose = require('mongoose');

var coinSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pair: String,
    platform_name_1: String,
    platform_name_2: String,
    time: {
        type: Array,
        required: true
    },
    difference:{
        type: Array,
        required: true
    }
});

var Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
