import { register ,login, forgetPassword, resetPassword, userVerification, logout} from "../controllers/auth.controller.js"
import express from "express"
import { getDataFromToken } from "../middleware/getDataFromToken.js"

const router = express.Router()

router.post("/api/auth/register",register)
router.post("/api/auth/userverification",getDataFromToken,userVerification)
router.post("/api/auth/login",login)
router.post("/api/auth/forgetpassword",forgetPassword)
router.patch("/api/auth/resetpassword",getDataFromToken,resetPassword)
router.post("/api/auth/logout",logout)

export default router;