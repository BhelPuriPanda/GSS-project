const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5,
	},
});

async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"DAPS Service Verification",
			`<h1>Welcome to Digital Asset Protection System (DAPS)!</h1><p>Your OTP for authentication is: <b>${otp}</b></p>`
		);
	} catch (error) {
		throw error;
	}
}

OTPSchema.pre("save", async function () {
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;