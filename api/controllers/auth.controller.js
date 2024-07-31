import User from "../models/User.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendMail } from "../healpers/sendmail.js";
import { createOtp } from "../healpers/otp.js";
import { emailOtpVerification } from "../healpers/emailVerificationMail.js";

export const register = async (req,res)=>{
    const{name,email,password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        const checkEmail = await User.findOne({email})

        if (checkEmail){
            return res.status(401).json({message:"Email already exist!"})
        }

        const otp = createOtp();
        const emailSent = await emailOtpVerification(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP. Please try again." });
        }


        const tokenData = {
            name:name,
            email:email,
            password:password,
            otp:otp
        }

        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"5m" })
        res.cookie("token",token,{httpOnly:true})
        res.status(200).json({message:"send otp"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
}

export const userVerification = async (req,res)=>{
    const userInputOtp = req.body.otp
    try {
        const {otp,name,email,password} = req.user
        console.log("otp",otp)
        console.log("userInputOtp",userInputOtp)
        if(otp != userInputOtp){
            return res.status(400).json({message:"invalid otp"})
        }


        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({name,email,password:hashedPassword})
        await newUser.save()
        res.status(201).json({message:"User created successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
}



export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        if (!email || !password){
            return res.status(401).json({message:"Email and password are required"})
        }

        const checkUser = await User.findOne({email})
        
        if(!checkUser){
            return res.status(401).json({message:"email does not exist"})
        }

        const checkPassword = await bcrypt.compare(password,checkUser.password)
        
        if(!checkPassword){
            return res.status(401).json({message:"wrong password"})
        }

        const tokenData = {
            id:checkUser._id,
            name:checkUser.name,
            email:checkUser.email,
        }

        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d" })
        res.cookie("token",token,{httpOnly:true})
        res.status(200).json({message:"login successful"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
}

export const forgetPassword = async(req,res)=>{
    const {email} = req.body
    try {
        if(!email){
            return res.status(400).json({ message: "email is required" })
        }

        const checkEmail = await User.findOne({email})
        if(!checkEmail){
            return res.status(401).json({message:"email is not present"})
        }

        const tokenData = {
            id:checkEmail._id,
            name:checkEmail.name,
            email:checkEmail.email
        }

        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"5m"})
        sendMail(email)
        res.cookie("token",token,{httpOnly:true})
        res.status(200).json({message:"email send"})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

export const resetPassword = async (req,res)=>{
    const {password} = req.body
    try {
        if (!password){
            return res.status(400).json({ message: "Password is required" });
        }
        const userid = req.user.id
        


        const hashedPassword = await bcrypt.hash(password,10)
        
        const user = await User.findByIdAndUpdate(
            userid,
            {password:hashedPassword},
            {new:true}
        )

        if(!user){
            return res.status(401).json({messgae:"password does not change"})
        }
        res.clearCookie("token")
        res.status(200).json({messgae:"password change successful"})

    } catch (error) {
        console.log("hello")
        return res.status(500).json({ message: error });
    }
}

export const logout = (req,res)=>{
    try{
        res.clearCookie("token")

        res.status(200).json({message:"logout successful"})
    }
    catch(error){
        res.status(500).json({message:error})
    }
}