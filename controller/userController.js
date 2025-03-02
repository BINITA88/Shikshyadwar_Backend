const User=require('../models/userModel')
const Token=require('../models/tokenModel')
const crypto=require('crypto')
const sendEmail=require('../utils/setEmail')
const { error } = require('console')
const fs = require("fs");
const jwt=require('jsonwebtoken')
const {expressjwt} =require('express-jwt')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// exports.postUser=async(req,res)=>{
//     let user= new User({
//         name:req.body.name,
//         email:req.body.email,
//         password:req.body.password
//     })
  
//     User.findOne({ email: user.email })
//     .then(async data => {
//         if (data) {
//             return res.status(400).json({ error: "Email is already registered. Please try again or try to login." });
//         } else {
//             user = await user.save();
//             if (!user) {
//                 return res.status(400).json({ error: 'Unable to register user' });
//             }

//             // Generate token and save
//             let token = new Token({
//                 token: crypto.randomBytes(16).toString('hex'),
//                 userId: user._id
//             });

//             token = await token.save();
//             if (!token) {
//                 return res.status(400).json({ error: "Unable to create token" });
//             }

//             const url = process.env.FRONT_END_URL + '/email/confirmation/' + token.token;

//             // Send email with verification link
//             sendEmail({
//                 from: 'no-reply@shikshyadwar.com',
//                 to: user.email,
//                 subject: "Email verification link",
//                 text: `Hello,\n\nPlease verify your email by clicking the link below:\n\nhttp://${req.headers.host}/api/confirmation/${token.token}`,
//                 html: `<h1>Verify your email account</h1><p>Please click the link below to verify your email:</p><a href="${url}">Click to verify</a>`
//             });
// text:

//             res.send(user);
//         }
//     })
//     .catch(err => {
//         return res.status(400).json({ error: err.message });
//     });

 

// }


exports.postUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered. Please try logging in." });
        }

        user = await user.save();
        if (!user) {
            return res.status(400).json({ error: 'Unable to register user' });
        }

        // Generate a verification token
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            userId: user._id
        });

        token = await token.save();
        if (!token) {
            return res.status(400).json({ error: "Unable to create token" });
        }

        // Generate verification URL
        const verificationUrl = `${process.env.FRONT_END_URL}/email/confirmation/${token.token}`;

        // Email template
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - Shikshyadwar</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    color: #e60050;
                    font-size: 24px;
                }
                p {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .verify-button {
                    display: inline-block;
                    background-color: #e60050;
                    color: white;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .verify-button:hover {
                    background-color: #c40044;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #888;
                }
                .footer a {
                    color: #e60050;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Shikshyadwar Consultancy!</h1>
                <p>Your email has been successfully registered. To start using our platform and access your courses, please verify your email.</p>
                <a href="${verificationUrl}" class="verify-button">Verify My Email</a>
                <p>If you didn’t request this, please ignore this email or <a href="mailto:support@shikshyadwar.com">contact support</a>.</p>
                <div class="footer">
                    <p>Shikshyadwar Consultancy © 2025. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send email with verification link
        await sendEmail({
            from: 'no-reply@shikshyadwar.com',
            to: user.email,
            subject: "Verify Your Email - Shikshyadwar",
            html: emailTemplate
        });

        res.json({ message: "Registration successful! Please check your email to verify your account." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// }

// // //register in signup  
// // exports.mobileSignup = async (req, res, next) => {
// //     const user = await User.findOne({ name: req.body.name });
// //     console.log(req.body,'image');

// //     if (user) {
// //       return res.status(400).send({ message: "Student already exists" });
// //     }
    
// //     await User.create(req.body);
  
// //     res.status(200).json({
// //       success: true,
// //       message: "Student created successfully",
// //     });
// //   };


// // to register in mobile
exports.signup = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact_no: req.body.contact_no,
        image: req.body.image
    });

    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: "Email is already registered. Please try again or try to login." });
            } else {
                user = await user.save();
                if (!user) {
                    return res.status(400).json({ error: 'Unable to register user' });
                }

                // Generate token and save
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id
                });

                token = await token.save();
                if (!token) {
                    return res.status(400).json({ error: "Unable to create token" });
                }

                const url = process.env.FRONT_END_URL + '/email/confirmation/' + token.token;

                // Send email with verification link and styled design
                sendEmail({
                    from: 'no-reply@ShikshyaDwar.com',
                    to: user.email,
                    subject: "Email Verification from Shikshyadwar",
                    html: `
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: 'Arial', sans-serif;
                                    background-color: #f5f5f5;
                                    color: #333;
                                    text-align: center;
                                    padding: 20px;
                                }
                                .container {
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    padding: 30px;
                                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                                    width: 90%;
                                    max-width: 650px;
                                    margin: 0 auto;
                                }
                                h1 {
                                    color: #e91e63; /* Dark Pink */
                                    font-size: 32px;
                                    margin-bottom: 20px;
                                }
                                p {
                                    font-size: 16px;
                                    color: #666;
                                    line-height: 1.5;
                                }
                           
                                .footer {
                                    font-size: 14px;
                                    color: #888;
                                    margin-top: 30px;
                                }
                                .footer a {
                                    color: #e91e63;
                                    text-decoration: none;
                                }
                                .footer a:hover {
                                    text-decoration: underline;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Welcome to Shikshyadwar Consultancy!</h1>
                                <p>Your email has been successfully verified. You are now part of Shikshyadwar, where we provide IELTS, PTE, SAT, and other preparatory classes to help you achieve your educational goals.</p>
                                <p>you have complete the process and now you can start accessing your courses and materials.</p>
                                <p class="footer">If you didn’t request this, please ignore this email or <a href="mailto:support@shikshyadwar.com">contact support</a>.</p>
                            </div>
                        </body>
                        </html>
                    `
                });

                res.send(user);
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err.message });
        });
}

// login for mobile
exports.login=async(req,res)=>{
    const{email,password}=req.body
    // email =req.body.email
    // at first check if the email is register or not
    const user=await User.findOne({email})
    if(!email){
        return res.status(400).json({error:"sorry, the email you have provided is not found in our system,please resgister first"})
    }
    // if email is found then cehck the password for the email
    // if(!user.authenticate(password)){
    //     return res.status(400).json({error:"email and password didn't match"})

    // }
  

    // token generate with user id,role and jwt secret. id ra secret
    const token =jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    
    // STORE TOKEN INTO COOKIE(STORE GARNA THAU)
    res.cookie('mycookie',token,{expire:Date.now()+99999})

    // return user information to frontend
    const{_id,role}=user
    return res.json({token,user:{email,role,_id}})

}




exports.uploadImage = async (req, res, next) => {
    // check for the file size and send an error message
    if (req.file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).send({
        message: 'Please upload an image less than ${process.env.MAX_FILE_UPLOAD}',
      });
    }
  
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
      success: true,
      data: req.file.filename,
    });
  };
  
// post email confirmation
exports.postEmailConfirmation=(req,res)=>{
    // fiets check token is present or not find calid or maticng token

    Token.findOne({token:req.params.token})
    .then(token=>{
        if(!token){
            return res.status(400).json({error:'Invalid token or token may have expired'})
              
        }
               // valid token lagi valid user huna paryo 
            // if we find the valid token then find valid user for that token
        User.findOne({_id:token.userId})
        .then(user=>{
            if(!user){
                return res.status(400).json({error:"we are unable top find valid user for token."})
            }
            // to check if the user is already verified or not 
            if(user.isverified){
                return res.status(400).json({error:"email is already verified "})
            }
            // verified chaina bahne save garna ra verified garna paryo
            user.isverified=true
            user.save()
            .then(user=>{
                if(!user){
                    return res.status(400).json({error:"failed to verify"})
                }
                res.json({message:"your email has been verified successfully."})
            })
            .catch(err=>{
                return res.status(400).json({error:err})
            })

        })
        .catch(err=>{
            return res.status(400).json({error:err})
        })
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}
// login for web 
exports.signin=async(req,res)=>{
    const{email,password}=req.body
    // email =req.body.email
    // at first check if the email is register or not
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({error:"sorry, the email you have provided is not found in our system,please resgister first"})
    }
    // if email is found then cehck the password for the email
    if(!user.authenticate(password)){
        return res.status(400).json({error:"email and password didn't match"})

    }
    if(!user.isverified){
        return res.status(400).json({error:"verify email first to continue"})
    }

    // token generate with user id,role and jwt secret. id ra secret
    const token =jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    
    // STORE TOKEN INTO COOKIE(STORE GARNA THAU)
    res.cookie('mycookie',token,{expire:Date.now()+99999})

    // return user information to frontend
    const{_id,name,role}=user
    return res.json({token,user:{name,role,email,_id}})

}




// otp part


// exports.signup = async (req, res) => {
//     try {
//         const { name, email, password, contact_no, role, otp, image } = req.body;

//         if (!name || !email || !password || !contact_no || !role || !otp || !image) {
//             return res.status(403).send({
//                 success: false,
//                 message: "All Fields are required",
//             });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         // Find the most recent OTP for the email
//         const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//         if (response.length === 0 || otp !== response[0].otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "The OTP is not valid",
//             });
//         }

//         // Secure password
//         let hashedPassword;
//         try {
//             hashedPassword = await bcrypt.hash(password, 10);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: Hashing password error: ${error.message}
//             });
//         }

//         // Create user
//         const newUser = await User.create({
//             name, email, password: hashedPassword, role, contact_no, image
//         });

//         return res.status(200).json({
//             success: true,
//             user: newUser,
//             message: "User created successfully ✅"
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "User registration failed"
//         });
//     }
// };

// exports.login = async(req, res)=> {

//     try {
//         //data fetch
//         const {email, password} = req.body
//         //validation on email and password
//         if(!email || !password){
//             return res.status(400).json({
//                 success:false,
//                 message: "Plz fill all the details carefully"
//             })
//         }

//         //check for registered User
//         let User= await  user.findOne({email})
//         //if user not registered or not found in database
//         if(!User){
//             return res.status(401).json({
//                 success: false,
//                 message: "You have to Signup First"
//             })
//         }

//         const payload ={
//             email: User.email,
//             id: User._id,
//             role: User.role,
//         }
//         //verify password and generate a JWt token 🔎
//         if(await bcrypt.compare(password,User.password)){
//             //if password matched
//              //now lets create a JWT token
//              let token = jwt.sign(payload, 
//                         process.env.JWT_SECRET,
//                         {expiresIn: "2h"}
//                         )
//             User = User.toObject()
//             User.token = token
            
//             User.password = undefined
//             const options = {
//                 expires: new Date( Date.now()+ 3*24*60*60*1000),
//                 httpOnly: true  //It will make cookie not accessible on clinet side -> good way to keep hackers away

//             }
//             res.cookie(
//                 "token",
//                 token,
//                 options
//             ).status(200).json({
//                 success: true,
//                 token,
//                 User,
//                 message: "Logged in Successfully✅"

//             })

//         }else{
//             //password donot matched
//             return res.status(403).json({
//                 success: false,
//                 message: "Password incorrects⚠"
//             })
//         }

//     } catch (error) {
//         console.error(error)
//         res.status(500).json({
//             success: false,
//             message: "Login failure⚠ :" + error
//         })
//     }

// }

exports.sendotp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Step 1: Check if the email exists in the User collection
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found, please register first.",
            });
        }

        // Step 2: Get the most recent OTP record for the provided email
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 }).exec();

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "No OTP found for this email. Please request a new one.",
            });
        }

        // Step 3: Check if OTP has expired (Assuming OTP expires in 5 minutes)
        const otpCreatedAt = new Date(otpRecord.createdAt);
        const currentTime = new Date();
        const timeDiff = (currentTime - otpCreatedAt) / 1000; // Convert to seconds

        if (timeDiff > 300) { // 300 seconds = 5 minutes
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one.",
            });
        }

        // Step 4: Ensure OTP provided is correct
        if (otpRecord.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        // Step 5: Mark the user as verified
        user.isverified = true; // Assuming 'isverified' is the field in the schema
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully ✅",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "OTP verification failed. Please try again.",
        });
    }
};



// exports.signup = async (req, res) => {
//     try {
//         const { name, email, password, contact_no, role, image } = req.body;

//         if (!name || !email || !password || !contact_no || !image) {
//             return res.status(403).send({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         // Secure password
//         let hashedPassword;
//         try {
//             hashedPassword = await bcrypt.hash(password, 10);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Hashing password error: ${error.message}'
//             });
//         }

//         // Create user but keep unverified
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             contact_no,
//             image,
//             isVerified: false, // New field for email verification
//         });

//         // Generate OTP
//         let otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false,
//         });

//         // Store OTP in the database
//         await OTP.create({ email, otp });

//         // Send OTP via email using Mailtrap
//         await sendEmail({
//             from: 'no-reply@shikshyadwar.com',
//             to: email,
//             subject: 'Email Verification from Shikshyadwar',
//             html: `
//                 <html>
//                 <head>
//                     <style>
//                         body {
//                             font-family: 'Arial', sans-serif;
//                             background-color: #f5f5f5;
//                             color: #333;
//                             text-align: center;
//                             padding: 20px;
//                         }
//                         .container {
//                             background-color: #ffffff;
//                             border-radius: 8px;
//                             padding: 30px;
//                             box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//                             width: 90%;
//                             max-width: 650px;
//                             margin: 0 auto;
//                         }
//                         h1 {
//                             color: #e91e63;
//                             font-size: 32px;
//                             margin-bottom: 20px;
//                         }
//                         p {
//                             font-size: 16px;
//                             color: #666;
//                             line-height: 1.5;
//                         }
//                         .footer {
//                             font-size: 14px;
//                             color: #888;
//                             margin-top: 30px;
//                         }
//                         .footer a {
//                             color: #e91e63;
//                             text-decoration: none;
//                         }
//                         .footer a:hover {
//                             text-decoration: underline;
//                         }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="container">
//                         <h1>Welcome to Shikshyadwar Consultancy!</h1>
//                         <p>Your OTP for email verification is: <strong>${otp}</strong></p>
//                         <p>Please use this OTP to verify your email and complete the registration process.</p>
//                         <p class="footer">If you didn’t request this, please ignore this email or <a href="mailto:support@shikshyadwar.com">contact support</a>.</p>
//                     </div>
//                 </body>
//                 </html>
//             `,
//         });

//         return res.status(200).json({
//             success: true,
//             message: "User registered successfully. Verify your email using the OTP sent to your email.",
//             userId: newUser._id,
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "User registration failed"
//         });
//     }
// };


// // Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
// 	try {
// 		const { email } = req.body;

// 		// Check if user is already present
// 		// Find user with provided email
// 		const checkUserPresent = await User.findOne({ email });
// 		// to be used in case of signup

// 		// If user found with provided email
// 		if (checkUserPresent) {
// 			// Return 401 Unauthorized status code with error message
// 			return res.status(401).json({
// 				success: false,
// 				message: User is Already Registered,
// 			});
// 		}

// 		var otp = otpGenerator.generate(6, {
// 			upperCaseAlphabets: false,
// 			lowerCaseAlphabets: false,
// 			specialChars: false,
// 		});
// 		const result = await OTP.findOne({ otp: otp });
// 		console.log("Result is Generate OTP Func");
// 		console.log("OTP", otp);
// 		console.log("Result", result);
// 		while (result) {
// 			otp = otpGenerator.generate(6, {
// 				upperCaseAlphabets: false,
// 			});
// 		}
// 		const otpPayload = { email, otp };
// 		const otpBody = await OTP.create(otpPayload);
// 		console.log("OTP Body", otpBody);
// 		res.status(200).json({
// 			success: true,
// 			message: OTP Sent Successfully,
// 			otp,
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		return res.status(500).json({ success: false, error: error.message });
// 	}
// };



// forgot password
// exports.forgetPassword=async(req,res)=>{
//     const user=await User.findOne({email:req.body.email})
//     if(!user){
//         return res.status(400).json({error:"sorry the email you have provided is not found in our system."})
//     }
//     // generate token and send 
//     let token=new Token({
//         token:crypto.randomBytes(16).toString('hex'),
//         userId:user._id
//     })
//     token=await token.save()
//     if(!token){
//         return res.status(400).json({erroe:"unable to create token"})
//     }

//     const url = process.env.FRONT_END_URL + '/resetpassword/' + token.token;
//     // send email process yesma rakheko utako option ma jancha 
//     sendEmail({
//         from:'no-reply@shikshyaDwar.com',
//         to:user.email,
//         subject:"password reset link",
    
//         text:`Hello,\n\nPlease verify your email by clicking the link below:\n\nhttp://${req.headers.host}/api/resetpassword/${token.token}`,
//          html: `<h1>Verify your email account</h1><p>Please click the link below to verify your email:</p><a href="${url}">Click to verify</a>`

//     })
//     res.json({message:'password reset link has been sent successfully.'})
// }






exports.forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                error: "Sorry, the email you provided is not found in our system.",
            });
        }

        // Generate reset token
        let token = new Token({
            token: crypto.randomBytes(16).toString("hex"),
            userId: user._id,
        });

        token = await token.save();
        if (!token) {
            return res.status(400).json({ error: "Unable to create token" });
        }

        // Password reset link
        const resetUrl = `${process.env.FRONT_END_URL}/resetpassword/${token.token}`;

        // HTML email template for password reset
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Shikshyadwar</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    color: #e60050;
                    font-size: 24px;
                }
                p {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .reset-button {
                    display: inline-block;
                    background-color: #e60050;
                    color: white;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .reset-button:hover {
                    background-color: #c40044;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #888;
                }
                .footer a {
                    color: #e60050;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to proceed.</p>
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
                <p>If you did not request this, please ignore this email or <a href="mailto:support@shikshyadwar.com">contact support</a>.</p>
                <div class="footer">
                    <p>Shikshyadwar Consultancy © 2025. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send email with password reset link
        await sendEmail({
            from: "no-reply@shikshyadwar.com",
            to: user.email,
            subject: "Reset Your Password - Shikshyadwar",
            html: emailTemplate,
        });

        res.json({
            message: "Password reset link has been sent successfully. Please check your email.",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// reset password
exports.resetPassword=async(req,res)=>{
    // find the valid token
    let token=await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"invalid token or token amy have expired"})
    }
    // if we found the valid token htne we find the valid user for that token
    let user=await User.findOne({_id:token.userId})
    if(!user){
        return res.status(400).json({error:"we are not able to find valid user for this token"})

    }
    // input new passwrod
    user.password =req.body.password
    user=await user.save()
    if(!user){
        return res.status(400).json({error:"failed to reset password."})
    }
    res.json({message:"password has been reset successfully,login to continue"})
}

// userlists
exports.userList=async(req,res)=>{
    const user=await User.find()
    .select('-Hashed_password')
    .select("-salt")
    if(!user){
        return res.status(400).json({error:"something went wrong"})

    }
    console.log("get list")
    res.send(user)
}

// userdetail
exports.userDetails=async(req,res)=>{
    const user=await User.findOne()
    if(!user){
        return res.status(400).json({error:"something went wrong"})

    }
    res.send(user)
}


// signout
exports.signout = (req, res) => {
    // Clear the cookie (assuming 'mycookie' is the name of the cookie you want to clear)
    res.clearCookie('mycookie');
    
    // Send a JSON response indicating successful signout
    res.json({ message: 'signout success' });
};


// sign in bina k k kura authorize garni

exports.requireSignin =expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    requestProperty:"user"
})
// divide role
// middle ware for user role
exports.requireUser=(req,res,next)=>{
    expressjwt({
        secret:process.env.JWT_SECRET,
        algorithms:['HS256']
    })(req,res,(err)=>{
        if(err){
            return res.status(400).json({error:"unauthorized"})
        }
        // signin bahyao bahen check role
        if(req.user.role===0){
            next()
        }
        else{
            return res.status(400).json({error:"Forbidden"})
        }
    })
        
}

// middle ware for admin role
exports.requireAdmin=(req,res,next)=>{
    expressjwt({
        secret:process.env.JWT_SECRET,
        algorithms:['HS256']
    })(req,res,(err)=>{
        if(err){
            return res.status(400).json({error:"unauthorized"})
        }
        // signin bahyao bahen check role
        if(req.user.role===1){
            next()
        }
        else{
            return res.status(400).json({error:"Forbidden"})
        }
    })
        
}


exports.deleteUser=(req,res)=>{
    Userser.findByIdAndDelete(req.params.id)
    .then(user=>{
        if(!user){
            // 400 not found
            return res.status(404).json({error:"user with that id is not found"})
        }else{
            return res.status(200).json({message:"user deleted"})
        }

       
    })
    .catch(err=>{
        return res.status(400).json({error:err})

    })
}








// -------------------- Email & SMS Configuration --------------------

// Configure Nodemailer transporter to use Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password or account password
    },
  });
  
  // Configure Twilio client (ensure you have TWILIO_* variables in your .env)
  const twilioClient = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  // Helper to send OTP via Email
  const sendEmailOTP = async (user, otp) => {
    const mailOptions = {
      from: process.env.EMAIL_USER, // using your EMAIL_USER as sender
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It is valid for 10 minutes`
    };
    await transporter.sendMail(mailOptions);
  };
  
  // Helper to send OTP via SMS
  const sendSMSOTP = async (user, otp) => {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}. It is valid for 10 minutes`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: user.phone,
    });
  };
  



// ✅ Forgot Password - Generate OTP
exports.forgotPassword1 = async (req, res, next) => {
    const { email, phone } = req.body;
  
    if (!email && !phone) {
      return res.status(400).json({ message: "Please provide an email or phone number" });
    }
  
    let user;
    if (email) {
      user = await User.findOne({ email });
    }
    if (!user && phone) {
      user = await User.findOne({ phone });
    }
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (email && user.email) {
      const emailOTP = user.generateEmailOTP();
      try {
        await sendEmailOTP(user, emailOTP);
        console.log("Email OTP sent:", emailOTP);
      } catch (error) {
        console.error("Error sending email OTP:", error);
        return res.status(500).json({ message: "Error sending email OTP" });
      }
    }
    if (phone && user.phone) {
      const phoneOTP = user.generatePhoneOTP();
      try {
        await sendSMSOTP(user, phoneOTP);
        console.log("SMS OTP sent:", phoneOTP);
      } catch (error) {
        console.error("Error sending SMS OTP:", error);
        return res.status(500).json({ message: "Error sending SMS OTP" });
      }
    }
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email/phone.",
    });
  };
  
  // ✅ Reset Password Using OTP
  exports.resetPassword1 = async (req, res, next) => {
    const { email, phone, otp, newPassword } = req.body;
  
    if (!otp || !newPassword || (!email && !phone)) {
      return res.status(400).json({
        message: "Please provide email/phone, otp, and a new password",
      });
    }
  
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found with that email" });
      }
      if (user.emailOTP !== otp || user.emailOTPExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP for email" });
      }
    } else if (phone) {
      user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: "User not found with that phone number" });
      }
      if (user.phoneOTP !== otp || user.phoneOTPExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP for phone" });
      }
    }
  
    user.password = newPassword;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  };
  