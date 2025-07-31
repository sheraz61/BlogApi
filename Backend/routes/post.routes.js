import express from 'express';
import upload from '../middlewares/multer.js'
import { createPost ,updatePost,deletePost} from '../controllers/post.controller.js';
import isAuth from '../middlewares/auth.js';
const router = express.Router();
router.post('/create', isAuth, upload.single('image'), createPost);
router.put('/update/:id',isAuth,upload.single('image'),updatePost)
router.delete('/del/:id', isAuth, deletePost);
export default router;
