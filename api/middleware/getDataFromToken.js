import jwt from "jsonwebtoken"

export const getDataFromToken = async (req,res,next)=>{
    const token = req.cookies.token
    // console.log("reqbody",req.body)
    console.log("token",token)
    try {
        if(!token){
            return res.satus(401).json({message:"No token present"})
        }
        console.log("asd")
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log("decodeToken",decodeToken)
        req.user =  decodeToken
        next()
    } catch (error) {
        console.log("error",error)
        return res.status(500).json({message:error})
    }
}  