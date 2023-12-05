module.exports = async (chat_id, name) => {
	const payload = {
		chat_id: chat_id,
		text: `Hello ${name}, Your 📅 attendance is marked for today's session at ${Date()}. Ready to participate! Thanks! 👍`
	}
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	}
	let data = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, options)
	data = await data.json()
	return data
}