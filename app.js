const express = require('express')
const face = require('./utils/face.util')
const mongo_connect = require('./databases/mongo.database')
const dotenv = require('dotenv')
dotenv.config()

const error_handler = require('./middlewares/error.middleware')
const face_route = require('./routes/face.route')

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({ "extended": true }))
app.use(express.json())
app.use('/public', express.static('public'))

app.use('/faces', face_route)

app.use((req, res) => { res.status(404).send({ message: 'no endpoint found!' }) })
app.use(error_handler)

app.listen(PORT, async () => {
	await face.load_models()
	await mongo_connect()
	console.log('Models Loaded')
	console.log('Server Started')
})