const mongoose = require("mongoose");
const mailSender = require("../utils/setEmail");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,  // OTP should be stored as a string
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "5m", // Document auto-deletes after 5 minutes
    },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
             <p>Your OTP code is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>`
        );
        console.log("Email sent successfully:", mailResponse);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw error;
    }
}

// Pre-save middleware to generate OTP and send email
OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        this.otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
