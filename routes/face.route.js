const express = require('express')
const multer = require('multer')
const { register_face, recognise_face } = require('../controllers/face.contorller')
const upload = multer()

const route = express.Router()
route.post('/register', upload.single('image'), register_face)
route.post('/recognise', upload.single('image'), recognise_face)

module.exports = route