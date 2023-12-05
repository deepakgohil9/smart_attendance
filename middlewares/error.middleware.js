module.exports = (err, req, res, next) => {
	console.log('[ERROR]')
	console.log(err)
	res.status(400).send({ message: 'Error Occured!', error: err.message })
}