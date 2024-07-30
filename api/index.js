import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.route.js"


dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("database connected");
})
.catch((error)=>{
    console.log(error)
})


const app = express()
app.use(express.json());
app.use(cookieParser()); 

// routes
app.use(authRouter)

app.listen(process.env.PORT,(req,res)=>{
    console.log("server is running")
})