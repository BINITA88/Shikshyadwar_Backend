const express=require('express')
const { login, postEmailConfirmation,sendotp, signup, forgetPassword, resetPassword, userList, userDetails, signout, requireSignin, requireAdmin, deleteUser, uploadImage, postUser, signin, forgotPassword, forgotPassword1, resetPassword1 } = require('../controller/userController')
const { validation, userValidation, passwordValidation } = require('../validation/Validator')
const router=express.Router()
const upload = require('../middleware/fileConfig')
router.post('/register',userValidation,passwordValidation,validation,postUser,)
// router.post('/register1',mobileSignup,)


router.post('/uploadImage', upload.single('profilePicture'), uploadImage);

router.post('/login', login)
router.post('/signup', signup)
router.post('/sendotp', sendotp)

router.post('/confirmation/:token',postEmailConfirmation)
router.post("/signin",signin)
// router.post("/signin1",login)
router.post("/forgetpassword",forgetPassword)
router.put("/resetpassword/:token", passwordValidation,validation, resetPassword)
router.get("/userlist",userList)
router.get("/userdetails/:id", requireSignin ,userDetails)
router.post("/signout",signout)
router.delete('/deleteUser/:id', requireSignin,requireAdmin,deleteUser)








router.post("/forgot-password", forgotPassword1);
router.post("/reset-password",resetPassword1);
module.exports=router









// const express=require('express')
// const { login, postEmailConfirmation, signup,getUserByGoogleEmail, forgotPassword,searchUsers, resetPassword,updateUserProfile, userList, userDetails, signout, requireSignin, requireAdmin, deleteUser, uploadImage, googleLogin } = require('../controller/userController')
// const { validation,  passwordValidation } = require('../validation/Validator')
// const router=express.Router()
// const upload =require('../middleware/fileupload')
// // router.post('/register',userValidation,passwordValidation,validation,postUser,)
// // router.post('/register1',mobileSignup,)

// // Apply the upload middleware to handle file uploads
// router.post('/uploadImage', upload.single('profilePicture'), uploadImage);

// router.post('/login', login)

// router.post('/signup', signup)
// // router.post('/sendotp', sendotp)

// router.post('/confirmation/:token',postEmailConfirmation)
// router.post("/forgetpassword",forgotPassword)
// // please check for route for web 


// router.put("/resetpassword", passwordValidation,validation, resetPassword)
// router.get("/userlist", requireSignin,userList)
// router.get("/userdetails/:id", requireSignin ,userDetails)
// router.post("/signout",signout)
// router.delete('/deleteUser/:id', requireSignin,requireAdmin,deleteUser)




// router.get("/search_users", requireSignin, searchUsers);
// router.put("/update_profile", requireSignin, updateUserProfile);

// router.post("/google", googleLogin);
// router.post("/getGoogleUser", getUserByGoogleEmail);

// module.exports=router


// const User=require('../models/userModel')
// const Token=require('../models/tokenModel')
// const crypto=require('crypto')
// const sendEmail=require('../utils/setEmail')
// const { error } = require('console')
// const fs = require("fs");
// const jwt=require('jsonwebtoken')
// const {expressjwt} =require('express-jwt')
// const OTP = require('../models/OTP')
// const otpGenerator = require('otp-generator');
// const bcrypt = require('bcryptjs');

// // // to register in web
// // exports.postUser=async(req,res)=>{
// //     let user= new User({
// //         name:req.body.name,
// //         email:req.body.email,
// //         password:req.body.password,
// //         contact_no:req.body.contact_no,
// //         image:req.body.image
   
// //     })
  
// //     User.findOne({ email: user.email })
// //     .then(async data => {
// //         if (data) {
// //             return res.status(400).json({ error: "Email is already registered. Please try again or try to login." });
// //         } else {
// //             user = await user.save();
// //             if (!user) {
// //                 return res.status(400).json({ error: 'Unable to register user' });
// //             }

// //             // Generate token and save
// //             let token = new Token({
// //                 token: crypto.randomBytes(16).toString('hex'),
// //                 userId: user._id
// //             });

// //             token = await token.save();
// //             if (!token) {
// //                 return res.status(400).json({ error: "Unable to create token" });
// //             }

// //             const url = process.env.FRONT_END_URL + '/email/confirmation/' + token.token;

// //             // Send email with verification link
// //             sendEmail({
// //                 from: 'no-reply@ecommerce.com',
// //                 to: user.email,
// //                 subject: "Email verification link",
// //                 text: Hello,\n\nPlease verify your email by clicking the link below:\n\nhttp://${req.headers.host}/api/confirmation/${token.token},
// //                 html: <h1>Verify your email account</h1><p>Please click the link below to verify your email:</p><a href="${url}">Click to verify</a>
// //             });

// //             res.send(user);
// //         }
// //     })
// //     .catch(err => {
// //         return res.status(400).json({ error: err.message });
// //     });

 

// // }

// // // //register in signup  
// // // exports.mobileSignup = async (req, res, next) => {
// // //     const user = await User.findOne({ name: req.body.name });
// // //     console.log(req.body,'image');

// // //     if (user) {
// // //       return res.status(400).send({ message: "Student already exists" });
// // //     }
    
// // //     await User.create(req.body);
  
// // //     res.status(200).json({
// // //       success: true,
// // //       message: "Student created successfully",
// // //     });
// // //   };


// // // to register in web
// // exports.mobileSignup = async (req, res) => {
// //     let user = new User({
// //         name: req.body.name,
// //         email: req.body.email,
// //         password: req.body.password,
// //         contact_no: req.body.contact_no,
// //         image: req.body.image
// //     });

// //     User.findOne({ email: user.email })
// //         .then(async data => {
// //             if (data) {
// //                 return res.status(400).json({ error: "Email is already registered. Please try again or try to login." });
// //             } else {
// //                 user = await user.save();
// //                 if (!user) {
// //                     return res.status(400).json({ error: 'Unable to register user' });
// //                 }

// //                 // Generate token and save
// //                 let token = new Token({
// //                     token: crypto.randomBytes(16).toString('hex'),
// //                     userId: user._id
// //                 });

// //                 token = await token.save();
// //                 if (!token) {
// //                     return res.status(400).json({ error: "Unable to create token" });
// //                 }

// //                 const url = process.env.FRONT_END_URL + '/email/confirmation/' + token.token;

// //                 // Send email with verification link and styled design
// //                 sendEmail({
// //                     from: 'no-reply@ecommerce.com',
// //                     to: user.email,
// //                     subject: "Email Verification from Shikshyadwar",
// //                     html: `
// //                         <html>
// //                         <head>
// //                             <style>
// //                                 body {
// //                                     font-family: 'Arial', sans-serif;
// //                                     background-color: #f5f5f5;
// //                                     color: #333;
// //                                     text-align: center;
// //                                     padding: 20px;
// //                                 }
// //                                 .container {
// //                                     background-color: #ffffff;
// //                                     border-radius: 8px;
// //                                     padding: 30px;
// //                                     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
// //                                     width: 90%;
// //                                     max-width: 650px;
// //                                     margin: 0 auto;
// //                                 }
// //                                 h1 {
// //                                     color: #e91e63; /* Dark Pink */
// //                                     font-size: 32px;
// //                                     margin-bottom: 20px;
// //                                 }
// //                                 p {
// //                                     font-size: 16px;
// //                                     color: #666;
// //                                     line-height: 1.5;
// //                                 }
                           
// //                                 .footer {
// //                                     font-size: 14px;
// //                                     color: #888;
// //                                     margin-top: 30px;
// //                                 }
// //                                 .footer a {
// //                                     color: #e91e63;
// //                                     text-decoration: none;
// //                                 }
// //                                 .footer a:hover {
// //                                     text-decoration: underline;
// //                                 }
// //                             </style>
// //                         </head>
// //                         <body>
// //                             <div class="container">
// //                                 <h1>Welcome to Shikshyadwar Consultancy!</h1>
// //                                 <p>Your email has been successfully verified. You are now part of Shikshyadwar, where we provide IELTS, PTE, SAT, and other preparatory classes to help you achieve your educational goals.</p>
// //                                 <p>you have complete the process and now you can start accessing your courses and materials.</p>
// //                                 <p class="footer">If you didn’t request this, please ignore this email or <a href="mailto:support@shikshyadwar.com">contact support</a>.</p>
// //                             </div>
// //                         </body>
// //                         </html>
// //                     `
// //                 });

// //                 res.send(user);
// //             }
// //         })
// //         .catch(err => {
// //             return res.status(400).json({ error: err.message });
// //         });
// // }






// exports.uploadImage = async (req, res, next) => {
//     // check for the file size and send an error message
//     if (req.file.size > process.env.MAX_FILE_UPLOAD) {
//       return res.status(400).send({
//         message: 'Please upload an image less than ${process.env.MAX_FILE_UPLOAD}',
//       });
//     }
  
//     if (!req.file) {
//       return res.status(400).send({ message: "Please upload a file" });
//     }
//     res.status(200).json({
//       success: true,
//       data: req.file.filename,
//     });
//   };
  
// // post email confirmation
// exports.postEmailConfirmation=(req,res)=>{
//     // fiets check token is present or not find calid or maticng token

//     Token.findOne({token:req.params.token})
//     .then(token=>{
//         if(!token){
//             return res.status(400).json({error:'Invalid token or token may have expired'})
              
//         }
//                // valid token lagi valid user huna paryo 
//             // if we find the valid token then find valid user for that token
//         User.findOne({_id:token.userId})
//         .then(user=>{
//             if(!user){
//                 return res.status(400).json({error:"we are unable top find valid user for token."})
//             }
//             // to check if the user is already verified or not 
//             if(user.isverified){
//                 return res.status(400).json({error:"email is already verified "})
//             }
//             // verified chaina bahne save garna ra verified garna paryo
//             user.isverified=true
//             user.save()
//             .then(user=>{
//                 if(!user){
//                     return res.status(400).json({error:"failed to verify"})
//                 }
//                 res.json({message:"your email has been verified successfully."})
//             })
//             .catch(err=>{
//                 return res.status(400).json({error:err})
//             })

//         })
//         .catch(err=>{
//             return res.status(400).json({error:err})
//         })
//     })
//     .catch(err=>{
//         return res.status(400).json({error:err})
//     })
// }
// // // login for web 
// // exports.signin=async(req,res)=>{
// //     const{email,password}=req.body
// //     // email =req.body.email
// //     // at first check if the email is register or not
// //     const user=await User.findOne({email})
// //     if(!user){
// //         return res.status(400).json({error:"sorry, the email you have provided is not found in our system,please resgister first"})
// //     }
// //     // if email is found then cehck the password for the email
// //     if(!user.authenticate(password)){
// //         return res.status(400).json({error:"email and password didn't match"})

// //     }
// //     if(!user.isverified){
// //         return res.status(400).json({error:"verify email first to continue"})
// //     }

// //     // token generate with user id,role and jwt secret. id ra secret
// //     const token =jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    
// //     // STORE TOKEN INTO COOKIE(STORE GARNA THAU)
// //     res.cookie('mycookie',token,{expire:Date.now()+99999})

// //     // return user information to frontend
// //     const{_id,name,role}=user
// //     return res.json({token,user:{name,role,email,_id}})

// // }




// // otp part


// // exports.signup = async (req, res) => {
// //     try {
// //         const { name, email, password, contact_no, role, otp, image } = req.body;

// //         if (!name || !email || !password || !contact_no || !role || !otp || !image) {
// //             return res.status(403).send({
// //                 success: false,
// //                 message: "All Fields are required",
// //             });
// //         }

// //         // Check if user already exists
// //         const existingUser = await User.findOne({ email });
// //         if (existingUser) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "User already exists"
// //             });
// //         }

// //         // Find the most recent OTP for the email
// //         const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
// //         if (response.length === 0 || otp !== response[0].otp) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "The OTP is not valid",
// //             });
// //         }

// //         // Secure password
// //         let hashedPassword;
// //         try {
// //             hashedPassword = await bcrypt.hash(password, 10);
// //         } catch (error) {
// //             return res.status(500).json({
// //                 success: false,
// //                 message: Hashing password error: ${error.message}
// //             });
// //         }

// //         // Create user
// //         const newUser = await User.create({
// //             name, email, password: hashedPassword, role, contact_no, image
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             user: newUser,
// //             message: "User created successfully ✅"
// //         });

// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({
// //             success: false,
// //             message: "User registration failed"
// //         });
// //     }
// // };

// // .................................



// const signup = async (req, res) => {
//     console.log(req.body);
//     const {  name, email, password, contact_no } = req.body;
  
//     if ( !name || !email || !password || !contact_no ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter all the fields...",
//       });
//     }
  
//     try {
//       const existingUser = await userModel.findOne({ email: email });
  
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "User already exists...",
//         });
//       }
  
//       const randomsalt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, randomsalt);
  
//       const newUser = new userModel({
  
//         name: name,
//         email: email,
//         password: hashedPassword,
//         contact_no: contact_no,
//       });
  
//       await newUser.save();
  
//       res.status(201).json({
//         success: true,
//         message: "User created successfully",
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   };
// const login = async (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;
  
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter all the fields...",
//       });
//     }
  
//     try {
//       const user = await userModel.findOne({ email: email });
  
//       if (!user) {
//         return res.status(400).json({
//           success: false,
//           message: "User not found...",
//         });
//       }
  
//       const isvalidPassword = await bcrypt.compare(password, user.password);
//       if (!isvalidPassword) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid credentials...",
//         });
//       }
  
//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET
//       );
  
//       res.status(201).json({
//         success: true,
//         message: "Login successful...",
//         token: token,
//         userData: {
//           id: user._id,
    
//           name: user.name,
//           email: user.email,
//           id: user._id,
//           contact_no: user.contact_no,
//           isAdmin: user.isAdmin,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error...",
//       });
//     }
//   };

// // exports.sendotp = async (req, res) => {
// //     try {
// //         const { email, otp } = req.body;

// //         // Step 1: Check if the email exists in the User collection
// //         const user = await User.findOne({ email });
// //         if (!user) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "User not found, please register first.",
// //             });
// //         }

// //         // Step 2: Get the most recent OTP record for the provided email
// //         const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 }).exec();

// //         if (!otpRecord) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "No OTP found for this email. Please request a new one.",
// //             });
// //         }

// //         // Step 3: Check if OTP has expired (Assuming OTP expires in 5 minutes)
// //         const otpCreatedAt = new Date(otpRecord.createdAt);
// //         const currentTime = new Date();
// //         const timeDiff = (currentTime - otpCreatedAt) / 1000; // Convert to seconds

// //         if (timeDiff > 300) { // 300 seconds = 5 minutes
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "OTP expired. Please request a new one.",
// //             });
// //         }

// //         // Step 4: Ensure OTP provided is correct
// //         if (otpRecord.otp.toString() !== otp.toString()) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Invalid OTP. Please try again.",
// //             });
// //         }

// //         // Step 5: Mark the user as verified
// //         user.isverified = true; // Assuming 'isverified' is the field in the schema
// //         await user.save();

// //         return res.status(200).json({
// //             success: true,
// //             message: "Email verified successfully ✅",
// //         });

// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({
// //             success: false,
// //             message: "OTP verification failed. Please try again.",
// //         });
// //     }
// // };


// // Forgot password function
// const forgotPassword = async (req, res) => {
//   console.log(req.body);

//   const { contact, contactMethod } = req.body;

//   if (!contact) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter your phone number or email",
//     });
//   }

//   let email, contact_no;

//   if (contactMethod === "email") {
//     email = contact;
//   } else if (contactMethod === "contact_no") {
//     contact_no = contact;
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter valid contact method",
//     });
//   }

//   try {
//     let user;
//     if (contact_no) {
//       user = await userModel.findOne({ contact_no: contact_no });
//     } else if (email) {
//       user = await userModel.findOne({ email: email });
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Generate OTP
//     const randomOTP = Math.floor(100000 + Math.random() * 900000);
//     console.log(randomOTP);

//     user.resetPasswordOTP = randomOTP;
//     user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
//     await user.save();

//     let isSent;
//     if (contact_no) {
//       // Send OTP to user phone number
//       isSent = await sendOtp(contact_no, randomOTP);
//     } else if (email) {
//       // Send OTP to user email
//       isSent = await sendEmailOtp(email, randomOTP);
//     }

//     if (!isSent) {
//       return res.status(400).json({
//         success: false,
//         message: "Error in sending OTP",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "OTP sent to your " + (contact_no ? "phone number" : "email"),
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// // Reset password function
// const resetPassword = async (req, res) => {
//   console.log(req.body);

//   const { contact, contactMethod, otp, password } = req.body;

//   if (!contact || !otp || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter all fields",
//     });
//   }

//   let email, contact_no;

//   if (contactMethod === "email") {
//     email = contact;
//   } else if (contactMethod === "contact_no") {
//     contact_no = contact;
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter valid contact method",
//     });
//   }

//   try {
//     let user;
//     if (contact_no) {
//       user = await userModel.findOne({ contact_no: contact_no });
//     } else if (email) {
//       user = await userModel.findOne({ email: email });
//     }

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Otp to integer
//     const otpToInteger = parseInt(otp);

//     if (user.resetPasswordOTP !== otpToInteger) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     if (user.resetPasswordExpires < Date.now()) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     const randomSalt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, randomSalt);

//     user.password = hashedPassword;
//     user.resetPasswordOTP = null;
//     user.resetPasswordExpires = null;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password reset successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



// // // forgot password
// // exports.forgetPassword=async(req,res)=>{
// //     const user=await User.findOne({email:req.body.email})
// //     if(!user){
// //         return res.status(400).json({error:"sorry the email you have provided is not found in our system."})
// //     }
// //     // generate token and send 
// //     let token=new Token({
// //         token:crypto.randomBytes(16).toString('hex'),
// //         userId:user._id
// //     })
// //     token=await token.save()
// //     if(!token){
// //         return res.status(400).json({erroe:"unable to create token"})
// //     }
// //     // send email process yesma rakheko utako option ma jancha 
// //     sendEmail({
// //         from:'no-reply@ecommerce.com',
// //         to:user.email,
// //         subject:"password reset link",
// //         text:`Hello,\n\n please verify your password by clicking the link given below \n\n 
// //         http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}
// //              `
// //             //  http://localhost:800/api/resetpassword/12343566

// //     })
// //     res.json({message:'password reset link has been sent successfully.'})
// // }

// // // reset password
// // exports.resetPassword=async(req,res)=>{
// //     // find the valid token
// //     let token=await Token.findOne({token:req.params.token})
// //     if(!token){
// //         return res.status(400).json({error:"invalid token or token amy have expired"})
// //     }
// //     // if we found the valid token htne we find the valid user for that token
// //     let user=await User.findOne({_id:token.userId})
// //     if(!user){
// //         return res.status(400).json({error:"we are not able to find valid user for this token"})

// //     }
// //     // input new passwrod
// //     user.password =req.body.password
// //     user=await user.save()
// //     if(!user){
// //         return res.status(400).json({error:"failed to reset password."})
// //     }
// //     res.json({message:"password has been reset successfully,login to continue"})
// // }

// // userlists
// exports.userList=async(req,res)=>{
//     const user=await User.find()
//     .select('-Hashed_password')
//     .select("-salt")
//     if(!user){
//         return res.status(400).json({error:"something went wrong"})

//     }
//     console.log("get list")
//     res.send(user)
// }

// // userdetail
// exports.userDetails=async(req,res)=>{
//     const user=await User.findOne()
//     if(!user){
//         return res.status(400).json({error:"something went wrong"})

//     }
//     res.send(user)
// }


// // signout
// exports.signout = (req, res) => {
//     // Clear the cookie (assuming 'mycookie' is the name of the cookie you want to clear)
//     res.clearCookie('mycookie');
    
//     // Send a JSON response indicating successful signout
//     res.json({ message: 'signout success' });
// };


// // sign in bina k k kura authorize garni

// exports.requireSignin =expressjwt({
//     secret:process.env.JWT_SECRET,
//     algorithms:['HS256'],
//     requestProperty:"user"
// })
// // divide role
// // middle ware for user role
// exports.requireUser=(req,res,next)=>{
//     expressjwt({
//         secret:process.env.JWT_SECRET,
//         algorithms:['HS256']
//     })(req,res,(err)=>{
//         if(err){
//             return res.status(400).json({error:"unauthorized"})
//         }
//         // signin bahyao bahen check role
//         if(req.user.role===0){
//             next()
//         }
//         else{
//             return res.status(400).json({error:"Forbidden"})
//         }
//     })
        
// }

// // middle ware for admin role
// exports.requireAdmin=(req,res,next)=>{
//     expressjwt({
//         secret:process.env.JWT_SECRET,
//         algorithms:['HS256']
//     })(req,res,(err)=>{
//         if(err){
//             return res.status(400).json({error:"unauthorized"})
//         }
//         // signin bahyao bahen check role
//         if(req.user.role===1){
//             next()
//         }
//         else{
//             return res.status(400).json({error:"Forbidden"})
//         }
//     })
        
// }


// exports.deleteUser=(req,res)=>{
//     Userser.findByIdAndDelete(req.params.id)
//     .then(user=>{
//         if(!user){
//             // 400 not found
//             return res.status(404).json({error:"user with that id is not found"})
//         }else{
//             return res.status(200).json({message:"user deleted"})
//         }

       
//     })
//     .catch(err=>{
//         return res.status(400).json({error:err})

//     })
// }







