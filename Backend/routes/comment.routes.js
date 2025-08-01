import express from 'express';
import  isAuth  from '../middlewares/auth.js'

import {
    createComment,
    getCommentsByPost,
    deleteComment,
    editComment

    
} from '../controllers/comment.controller.js';

const router = express.Router();
router.post('/:id', isAuth, createComment);
router.get('/:id',isAuth,getCommentsByPost)
router.put('/:id',isAuth,editComment)
router.delete('/:id',isAuth,deleteComment)

export default router;
