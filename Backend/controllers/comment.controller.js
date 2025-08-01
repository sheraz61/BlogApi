import {Comment} from '../models/comment.model.js'
import {Post} from'../models/post.model.js' 
import {User} from '../models/user.model.js'

export const createComment = async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized user' });
    }
    const comment = await Comment.create({
      content,
      author: {
        _id: user._id,
        username: user.username,
      },
      post: post._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    console.error('Create Comment Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const  postId  = req.params.id;
    const post=await Post.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"Post not found"
            ,success:false
        })
    }
    // Get all comments for the post
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username _id')               
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message:"Post Comment Get Successfully",
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error('Get Comments Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const editComment = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const  commentId  = req.params.id;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    comment.content = content || comment.content;
    await comment.save();
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    console.error('Edit Comment Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const  commentId  = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    // Allow comment author or admin to delete
    if (comment.author._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete Comment Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};