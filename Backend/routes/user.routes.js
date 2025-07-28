import { Router } from "express";
import {
    createUser,
    addEmail,
    verifyEmailCode,
    cancelAddEmail,
    changeEmail,
    changePassword,
    forgetPassword,
    verifyForgetPassword,
    getMyProfile,
    loginUser,
    logout
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.js";
const router = Router()
router.post('/create', createUser)
router.post('/login', loginUser)
router.post('/add-email/:id',isAuth,addEmail)
router.get("/verify-email/:id", isAuth,verifyEmailCode)
router.post('/change-email/:id',isAuth,changeEmail)
router.get("/cancel-email/:id", isAuth,cancelAddEmail)
router.post('/logout', isAuth, logout)
router.get('/profile/:id', isAuth, getMyProfile)
router.post('/change-password/:id', isAuth, changePassword)
router.post('/forget-password',forgetPassword)
router.post('/verify-forget-password',verifyForgetPassword)
export default router