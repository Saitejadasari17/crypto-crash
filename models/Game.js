const mongoose = require('mongoose');
const GameSchema = new mongoose.Schema({});
module.exports = mongoose.model('Game', GameSchema);