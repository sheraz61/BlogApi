import { Router } from "express";
import upload from '../middlewares/multer.js'
import { setUploadTarget } from "../middlewares/setUploadTraget.js";
import {
    registerUser,
    deleteAccount,
    loginUser,
    logout,
    addBio,
    updateBio,
    editUserProfile,
    updateProfileImage,
    deleteProfileImage,
    addEmail,
    verifyEmailCode,
    cancelAddEmail,
    changeEmail,
    changePassword,
    forgetPassword,
    verifyForgetPassword,
    cancelForgetPasword,
    getMyProfile,
    uploadProfileImage,
    getPublicProfile,
    getLoginHistory
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.js";
const router = Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/edit-profile', isAuth, editUserProfile);
router.post("/bio", isAuth, addBio);
router.put("/bio", isAuth, updateBio);
router.post('/upload-profile', isAuth,setUploadTarget('profile'), upload.single('image'), uploadProfileImage)
router.delete("/delete-profile", isAuth, deleteProfileImage);
router.put("/update-profile-image", isAuth, setUploadTarget('profile'), upload.single("image"), updateProfileImage);
router.delete("/delete", isAuth, deleteAccount);
router.post('/add-email', isAuth, addEmail)
router.get("/verify-email", isAuth, verifyEmailCode)
router.post('/change-email', isAuth, changeEmail)
router.get("/cancel-email", isAuth, cancelAddEmail)
router.post('/logout', isAuth, logout)
router.get('/profile', isAuth, getMyProfile)
router.post('/change-password', isAuth, changePassword)
router.post('/forget-password', forgetPassword)
router.post('/verify-forget-password', verifyForgetPassword)
router.post("/cancel-forget", cancelForgetPasword);
router.get('/profile/:username', getPublicProfile);
router.get("/login-history", isAuth, getLoginHistory);

export default router