import nodemailer from "nodemailer"

export const sendMail = async (email)=>{
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
            subject: " change password ", 
            text: "click the link to reset password http://localhost:8000/passwordreset", 
          });


    } catch (error) {
        console.log(error)
        return error
    }
}