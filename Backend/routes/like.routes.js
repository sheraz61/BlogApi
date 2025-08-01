import express from 'express';
import  isAuth  from '../middlewares/auth.js'
import {
 toggleLikePost
} from '../controllers/like.controller.js';

const router = express.Router();

router.post('/:id', isAuth, toggleLikePost);

export default router;
