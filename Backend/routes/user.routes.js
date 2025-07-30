import { Router } from "express";
import {
    registerUser,
    deleteAccount,
    loginUser,
    logout,
    editUserProfile,
    addEmail,
    verifyEmailCode,
    cancelAddEmail,
    changeEmail,
    changePassword,
    forgetPassword,
    verifyForgetPassword,
    cancelForgetPasword,
    getMyProfile,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.js";
const router = Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/edit-profile', isAuth, editUserProfile);
router.delete("/delete", isAuth, deleteAccount);
router.post('/add-email',isAuth,addEmail)
router.get("/verify-email", isAuth,verifyEmailCode)
router.post('/change-email',isAuth,changeEmail)
router.get("/cancel-email", isAuth,cancelAddEmail)
router.post('/logout', isAuth, logout)
router.get('/profile/', isAuth, getMyProfile)
router.post('/change-password', isAuth, changePassword)
router.post('/forget-password',forgetPassword)
router.post('/verify-forget-password',verifyForgetPassword)
router.post("/cancel-forget", cancelForgetPasword);

export default router