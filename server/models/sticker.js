var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StickerSchema = new Schema({
	link: { type: String, required: 'Url required', index: { unique: true }} 
});

module.exports = mongoose.model('Request', RequestSchema);
