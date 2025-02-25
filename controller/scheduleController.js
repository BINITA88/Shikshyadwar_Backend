// const Schedule =require('../models/scheduleModels')




// // GET /api/schedules/getschedule
// exports.getSchedules  = async (req, res) => {
//   try {
//     const schedules = await Schedule.find({});
//     if (schedules.length === 0) {
//       return res.status(404).json({ error: 'No schedules found' });
//     }
//     res.json({ schedules });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.createSchedule = async (req, res) => {
//   console.log(req.body);  // Log the incoming request body
//   const newSchedule = new Schedule(req.body);
  
//   newSchedule.save()
//     .then(schedule => res.status(200).json(schedule))
//     .catch(err => res.status(400).json({ message: err.message }));
// };



// // Update a schedule
// exports.updateSchedule = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Validate if the schedule exists before updating
//     const schedule = await Schedule.findById(id);
//     if (!schedule) {
//       return res.status(404).json({ message: 'Schedule not found' });
//     }

//     const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
//     res.status(200).json(updatedSchedule);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update schedule', error: error.message });
//   }
// };

// // Delete a schedule
// exports.deleteSchedule = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const schedule = await Schedule.findById(id);
//     if (!schedule) {
//       return res.status(404).json({ message: 'Schedule not found' });
//     }

//     await Schedule.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Schedule deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete schedule', error: error.message });
//   }
// };


// const User=require('../models/userModel')




const Schedule = require('../models/scheduleModels');

// ✅ Get all schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    if (schedules.length === 0) {
      return res.status(404).json({ error: 'No schedules found' });
    }
    res.json({ schedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Create a schedule
exports.createSchedule = async (req, res) => {
  console.log(req.body);
  const newSchedule = new Schedule(req.body);

  try {
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update a schedule
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update schedule', error: error.message });
  }
};

// ✅ Delete a schedule
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await Schedule.findByIdAndDelete(id);
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete schedule', error: error.message });
  }
};

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


// exports.uploadImage = async (req, res, next) => {
//     // check for the file size and send an error message
//     if (req.file.size > process.env.MAX_FILE_UPLOAD) {
//       return res.status(400).send({
//         message: "Please upload an image less than ${process.env.MAX_FILE_UPLOAD"},
    
//       )}
  
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
// exports.signup = async (req, res) => {
//     try {
//         const { name, email, password, role, otp, contact_no } = req.body;

//         if (!name || !email || !password || !otp || !contact_no) {
//             return res.status(403).send({
//                 success: false,
//                 message: "All Fields are required",
//             });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         // Find the latest OTP for this email
//         const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

//         if (response.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No OTP found. Please request a new one.",
//             });
//         }

//         console.log("Stored OTP:", response[0].otp);
//         console.log("User-entered OTP:", otp);

//         if (otp !== response[0].otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "The OTP is not valid",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//             contact_no,
//         });

//         return res.status(200).json({
//             success: true,
//             user,
//             message: "User created successfully ✅",
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "User registration failed",
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
//         let User= await  User.findOne({email})
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
//                 message: "Password incorrects⚠️"
//             })
//         }

//     } catch (error) {
//         console.error(error)
//         res.status(500).json({
//             success: false,
//             message: "Login failure⚠️ :" + error
//         })
//     }

// }

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
// 				message: `User is Already Registered`,
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
// 			message: `OTP Sent Successfully`,
// 			otp,
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		return res.status(500).json({ success: false, error: error.message });
// 	}
// };

// // forgot password
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
//     // send email process yesma rakheko utako option ma jancha 
//     sendEmail({
//         from:'no-reply@ecommerce.com',
//         to:user.email,
//         subject:"password reset link",
//         text:`Hello,\n\n please verify your password by clicking the link given below \n\n 
//         http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}
//              `
//             //  http://localhost:800/api/resetpassword/12343566

//     })
//     res.json({message:'password reset link has been sent successfully.'})
// }

// // reset password
// exports.resetPassword=async(req,res)=>{
//     // find the valid token
//     let token=await Token.findOne({token:req.params.token})
//     if(!token){
//         return res.status(400).json({error:"invalid token or token amy have expired"})
//     }
//     // if we found the valid token htne we find the valid user for that token
//     let user=await User.findOne({_id:token.userId})
//     if(!user){
//         return res.status(400).json({error:"we are not able to find valid user for this token"})

//     }
//     // input new passwrod
//     user.password =req.body.password
//     user=await user.save()
//     if(!user){
//         return res.status(400).json({error:"failed to reset password."})
//     }
//     res.json({message:"password has been reset successfully,login to continue"})
// }

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

//     })
// }






















