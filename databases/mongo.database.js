const mongoose = require('mongoose')

module.exports = async () => {
	try {
		await mongoose.connect(process.env.MONGO)
	} catch (err) {
		throw new Error(err)
	}
}