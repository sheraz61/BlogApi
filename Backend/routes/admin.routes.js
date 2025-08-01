import { Router } from "express";
import isAdmin from '../middlewares/isAdmin.js'
import {
    getAdminDashboardStats,
    getAllUsers,
    getVerifiedUsers,
    getUserFullDetailById,
    deleteUserByAdmin,
    getAllPostTitles,
    getPostDetailsById,deleteAnyPost
} from '../controllers/admin.controller.js'
import isAuth from "../middlewares/auth.js";
const router = Router()
router.get('/dashboard', isAuth, isAdmin, getAdminDashboardStats);
router.get('/users', isAuth, isAdmin, getAllUsers);
router.get('/users/verified', isAuth, isAdmin, getVerifiedUsers);
router.get('/user/:id', isAuth, isAdmin, getUserFullDetailById);
router.delete('/user/:id', isAuth, isAdmin, deleteUserByAdmin);
router.get('/posts', isAuth, isAdmin, getAllPostTitles);        
router.get('/posts/:id', isAuth, isAdmin, getPostDetailsById); 
router.delete('/post/:id', isAuth, isAdmin, deleteAnyPost);

export default router