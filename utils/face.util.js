const faceapi = require('@vladmandic/face-api')
const tf = require('@tensorflow/tfjs-node')

const load_models = async () => {
	try {
		await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')
		await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
		await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights')
	} catch (error) {
		throw new Error('Failed to load models!')
	}
}

const generate_tensor = async (img_buff) => {
	const decodeT = faceapi.tf.node.decodeImage(img_buff, 3)
	const expandT = faceapi.tf.expandDims(decodeT, 0)
	return expandT
}

const get_descriptor = async (img_buff) => {
	const tensor = await generate_tensor(img_buff)
	const detection = await faceapi.detectSingleFace(tensor).withFaceLandmarks().withFaceDescriptor()
	if (detection == undefined) {
		throw new Error('No face detected in image')
	}
	return detection.descriptor
}

const get_labeled_descriptor = async (img_buff, label) => {
	const descriptor = await get_descriptor(img_buff)
	const labeled_descriptor = new faceapi.LabeledFaceDescriptors(label, [descriptor])
	return labeled_descriptor
}

const recognise_face = async (img_buff, faces_data) => {
	if (faces_data.length == 0) {
		throw new Error('no faces registered!')
	}

	const faces = faces_data.map((face) => {
		const label = face._label
		const descriptors = face._descriptors.map(descriptor => new Float32Array(Object.values(descriptor)))
		return new faceapi.LabeledFaceDescriptors(label, descriptors)
	})

	const descriptor = await get_descriptor(img_buff)
	const matcher = new faceapi.FaceMatcher(faces)
	const match = await matcher.findBestMatch(descriptor)
	return match
}

module.exports = { load_models, get_labeled_descriptor, recognise_face }