const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CompanytSchema = new mongoose.Schema({

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
	evaluation: {
		type: Number
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
	description: {
		type: String,
		required: true
	},
	specialization: {
		type: String,
		required: true
	},
	tokenCode: Number,
	avatar: String,
	Data_company: {
		type: Date,
		default: Date.now
	}
}, {
	toJSON: {
		virtuals: true
	},
});

CompanytSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;

	next();
});

CompanytSchema.virtual('avatar_url').get(function () {
	return `http://localhost:3333/files/${this.avatar}`
})

module.exports = mongoose.model("company", CompanytSchema);