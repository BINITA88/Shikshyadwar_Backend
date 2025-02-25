
// const mongoose=require('mongoose')
// const uuidv1=require('uuidv1')
// // Crypto is used for used for hashing the password.
// const crypto=require('crypto')
// const { type } = require('os')

// // define schema

// const userSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         // agadi ra pachdi ko space hataucha
//         trim:true,

//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//         // agadi ra pachdi ko space hataucha
//         trim:true,

//     },
//     image:{
//         type:String,
//         default: null,
//     },
    
//     contact_no:{
//         type:Number,
//         default: '',
//         // required:true,
//     },
//     Hashed_password:{
//         type:String,
//         required:true,
//         // agadi ra pachdi ko space hataucha
//         trim:true,

//     },
   
//     // mathiko uuidv1 le random string generate garca so salt bahnni variable banayara rakhni tesma string
//     salt:String,
//     role:{
//         type:Number,
//         default:0
//         // admin cha bahne 1 otherwise user cha bahne default:0 
//     },
//     // email verified cah ki chaina ko lagi gareko
//     isverified:{
//         type:Boolean,
//         default:0,
//         // default ma O cha bahnesi verified chaina initially.
//     }
//     },{timestamps:true})

//     // virtual field is ._password

//     userSchema.virtual('password')
//     .set( function(password){
//         this._password=password
//         this.salt=uuidv1()
//         this.Hashed_password=this.encryptPassword(password)
//     })
//     // .get: Returns the plain text password (_password) if it's ever needed during runtime (though it won’t be saved in the DB).
//     .get(function(){
//         return this._password
//     })



//     // This method, encryptPassword, takes the user's plain text password, combines it with the unique salt, and hashes it using the sha1 algorithm.crypto.Hmac('sha1', this.salt): Uses HMAC (Hash-based Message Authentication Code) with the SHA1 algorithm and the generated salt to hash the password..update(password): Updates the hash with the plain text password..digest('hex'): Converts the hashed output into a hexadecimal string.

//     userSchema.methods={
//         // virtual ma jun parameter legecha tei lekhni funcion ko bitra
//         encryptPassword:function(password){
//             try{
//                 // algorithm use garera auta arko string banauni 2 OTTA String garera strong banauni password
//                 return crypto.Hmac('sha1',this.salt)
//                 .update(password)
//                 // hex means 0-9 A-F
//                 .digest('hex')

//             }
//             catch(err){
//                 return err 
//             }
//         },
//         authenticate:function(plainText){
//             return this.encryptPassword(plainText)==this.Hashed_password
//         }
//     }
// module.exports=mongoose.model('User',userSchema)

// for mobile
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // ✅ Use uuidv4 instead of deprecated uuidv1
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        image: { type: String, default: null },
        contact_no: { type: String, unique: true, sparse: true },
        Hashed_password: { type: String, required: true, trim: true },
        salt: String,
        role: { type: Number, default: 0 },
        isverified: { type: Boolean, default: false },

        // 🔹 Fields for OTP Verification & Password Reset
        emailOTP: { type: String, default: null }, // ✅ OTP for email verification
        emailOTPExpires: { type: Date, default: null }, // ✅ OTP expiration time

        forgotPasswordOTP: { type: String, default: null },
        forgotPasswordOTPExpires: { type: Date, default: null },

        resetPasswordOTP: { type: String, default: null },
        resetPasswordOTPExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

// ✅ Virtual field for password hashing
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4(); // ✅ Use uuidv4() for salt generation
        this.Hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    // 🔹 Hash password using crypto
    encryptPassword: function (password) {
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return err;
        }
    },

    // 🔹 Compare input password with hashed password
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.Hashed_password;
    },

    // ✅ Generate OTP for Email Verification
    generateEmailOTP: function () {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.emailOTP = otp;
        this.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        return otp;
    },

    // ✅ Generate OTP for Forgot Password
    generateForgotPasswordOTP: function () {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.forgotPasswordOTP = otp;
        this.forgotPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        return otp;
    },

    // ✅ Generate OTP for Reset Password
    generateResetPasswordOTP: function () {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.resetPasswordOTP = otp;
        this.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        return otp;
    },

    // ✅ Verify OTP
    verifyOTP: function (otp, type) {
        const currentTime = new Date();
        if (type === "forgotPassword") {
            if (this.forgotPasswordOTP === otp && this.forgotPasswordOTPExpires > currentTime) {
                this.forgotPasswordOTP = null;
                this.forgotPasswordOTPExpires = null;
                return true;
            }
        } else if (type === "resetPassword") {
            if (this.resetPasswordOTP === otp && this.resetPasswordOTPExpires > currentTime) {
                this.resetPasswordOTP = null;
                this.resetPasswordOTPExpires = null;
                return true;
            }
        } else if (type === "emailVerification") {
            if (this.emailOTP === otp && this.emailOTPExpires > currentTime) {
                this.emailOTP = null;
                this.emailOTPExpires = null;
                return true;
            }
        }
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
