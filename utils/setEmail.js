const nodemailer=require('nodemailer')

const sentEmail=options=>{
    // Looking to send emails in production? Check out our Email API/SMTP product!
   const  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:  process.env.SMTP_PORT,
    auth: {
      user:  process.env.SMTP_USER,
      pass:  process.env.SMTP_PASS
    }
  });
  const mailOptions={
    from:options.from,
    to:options.to,
    subject:options.subject,
    text:options.text,
    html:options.html
  }
  transport.sendMail(mailOptions)


}
module.exports=sentEmail

// MAIL PATHAUNI RA VERIFIED GARNI KAAM BHOLI KO 







// const mailSender = async (email, title, body)=>{
//     try {
//         //to send email ->  firstly create a Transporter
//         let transporter = nodemailer.createTransport({

// host: process.env.SMTP_HOST,
//     port:  process.env.SMTP_PORT,
//     auth: {
//       user:  process.env.SMTP_USER,
//       pass:  process.env.SMTP_PASS
//     }
//         }) 

//         //now Send e-mails to users
//         let info = await transporter.sendMail({
//             from: 'www.sandeepdev.me - Sandeep Singh',
//             to:`${email}`,
//                 subject: `${title}`,
//                 html: `${body}`,
//         })

//         console.log("Info is here: ",info)
//         return info

//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = mailSender;
// mm