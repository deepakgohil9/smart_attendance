const mongoose = require('mongoose')

const users_schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	chat_id: {
		type: Number,
		required: true,
		unique: true
	},
	labeled_descriptors: {
		type: Object,
		required: true
	}
})

module.exports = mongoose.model('User', users_schema)