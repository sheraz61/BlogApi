import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';

//  Add bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findById(userId);
    const post = await Post.findById(postId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if(!post){
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const isBookmarked = user.bookmarks.includes(postId);
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
      await user.save();
      return res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
    } else {
      user.bookmarks = user.bookmarks || [];
      user.bookmarks.push(postId);
      await user.save();
      return res.status(200).json({ success: true, message: 'Post bookmarked successfully' });
    }
  } catch (error) {
    console.error('Toggle Bookmark Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

//  Get all bookmarked posts
export const getBookmarkedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      select: 'title category image createdAt author content', // only necessary fields
    });

    return res.status(200).json({
        message:"Bookmark Post Fetch Successfully",
        success: true, 
        bookmarks: user.bookmarks
     });
  } catch (error) {
    console.error('Get Bookmarks Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
