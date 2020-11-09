const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ClientSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	},
	cpfcnpj: {
		type: Number,
		required: true
	},
	locality: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	tokenCode: Number,
	avatar: String,
	Data_client: {
		type: Date,
		default: Date.now
	}
}, {
	toJSON: {
		virtuals: true
	},
});

ClientSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;

	next();
});

ClientSchema.virtual('avatar_url').get(function () {
	return `http://localhost:3333/files/${this.avatar}`
})

module.exports = mongoose.model("client", ClientSchema);