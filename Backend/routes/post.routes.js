import express from 'express';
import upload from '../middlewares/multer.js'
import { setUploadTarget } from '../middlewares/setUploadTraget.js';
import { createPost ,updatePost,deletePost,getAllPosts,getPostById} from '../controllers/post.controller.js';
import isAuth from '../middlewares/auth.js';
const router = express.Router();
router.get('/', getAllPosts); 
router.get('/:id', getPostById);
router.post('/create', isAuth, setUploadTarget('post'),upload.single('image'), createPost);
router.put('/update/:id',isAuth,setUploadTarget('post'),upload.single('image'),updatePost)
router.delete('/del/:id', isAuth, deletePost);
export default router;
