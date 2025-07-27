import { Router } from "express";
import { createUser,addEmail,verifyEmail, changeEmail, changePassword, getMyProfile, loginUser, logout } from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.js";
const router = Router()
router.post('/create', createUser)
router.post('/login', loginUser)
router.post('/add-email/:id',isAuth,addEmail)
router.post('/change-email/:id',isAuth,changeEmail)
router.get("/verify-email/:token", verifyEmail)
router.post('/logout', isAuth, logout)
router.get('/profile/:id', isAuth, getMyProfile)
router.post('/change-password/:id', isAuth, changePassword)
export default router