import nodemailer from "nodemailer"

export const emailOtpVerification = async (email,otp)=>{
    try {
        
        let config = {
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          };
    
          let transporter = nodemailer.createTransport(config);

          const info = await transporter.sendMail({
            from: `"Aman " <${process.env.EMAIL}>`, 
            to: email, 
            subject: " email verification  ", 
            text: ` your otp is ${otp} `  , 
          });

          return info
    } catch (error) {
        console.log(error)
        return error
    }
}