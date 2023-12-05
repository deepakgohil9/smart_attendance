const User = require('../models/users.model')
const face = require('../utils/face.util')
const send_message = require('../utils/send_message.util')
const fs = require('fs')

const register_face = async (req, res, next) => {
	try {
		const img_buff = req.file.buffer
		const user = new User({
			name: req.body.name,
			chat_id: req.body.chat_id,
			labeled_descriptors: {}
		})
		await user.save()
		user.labeled_descriptors = await face.get_labeled_descriptor(img_buff, user._id.toString())
		await user.save()
		res.send({ message: 'Face registered success!', data: user })
	} catch (error) {
		next(error)
	}
}

const recognise_face = async (req, res, next) => {
	try {
		const img_buff = req.file.buffer
		fs.writeFileSync('public/img.jpeg', img_buff)
		const faces = await User.distinct('labeled_descriptors')
		const data = await face.recognise_face(img_buff, faces)
		if (data._label == 'unknown') {
			res.send({ message: 'Unknown face', data: { name: 'unknown', distance: data._distance } })
			return
		}
		let user = await User.findById(data._label, { labeled_descriptors: 0 })
		user = user.toObject()
		await send_message(user.chat_id, user.name)
		res.send({ message: `${user.name}'s face detected`, data: { ...user, distance: data._distance } })
	} catch (error) {
		next(error)
	}
}

module.exports = { register_face, recognise_face }