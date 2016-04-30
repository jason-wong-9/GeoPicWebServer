var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StickerSchema = new Schema({
	link: { type: String, required: 'Url required', index: { unique: true }},
	riddle: { type: String },
	creator: { type: Schema.Types.ObjectId, ref: "User" },
	found: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model('Sticker', StickerSchema);
