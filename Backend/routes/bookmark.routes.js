import express from 'express';
import  isAuth  from '../middlewares/auth.js'
import {
 toggleBookmark,
  getBookmarkedPosts
} from '../controllers/bookmark.controller.js';

const router = express.Router();

router.post('/:id', isAuth, toggleBookmark);
router.get('/', isAuth, getBookmarkedPosts);

export default router;
