import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"; // Adjust if your model name is different
import cloudinary from '../config/cloudinary.js';

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalPosts = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        totalPosts,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name username');
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getVerifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ isVerified: true }).select('_id name username email');
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get Verified Users Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserFullDetailById = async (req, res) => {
  try {
    const userId = req.params.id;
    // 1. Get user basic info
    const user = await User.findById(userId).select('username email name isVerified profileImage bio');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // 2. Get all posts by this user
    const posts = await Post.find({ 'author._id': userId }).select('title content image.url likes category createdAt');
    return res.status(200).json({
      success: true,
      user,
      totalPosts: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Admin User Detail Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId  = req.params.id;
    // 1. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // 2. Delete user profile image if stored on Cloudinary
    if (user.profileImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      } catch (err) {
        console.warn('Cloudinary image deletion failed:', err.message);
      }
    }
    // 3. Delete all posts created by this user
    const posts = await Post.find({ 'author._id': userId });
    if (posts) {
      for (const post of posts) {
        if (post.image?.public_id) {
          try {
            await cloudinary.uploader.destroy(post.image.public_id);
          } catch (err) {
            console.warn(`Failed to delete image of post ${post._id}:`, err.message);
          }
        }
        await post.deleteOne();
      }
    }
    // 4. Delete user account
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: 'User and associated posts deleted successfully',
    });

  } catch (error) {
    console.error('Delete User by Admin Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllPostTitles = async (req, res) => {
  try {
    const posts = await Post.find({}, 'title _id').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Post titles fetched successfully',
      posts, // [{ _id, title }]
    });
  } catch (error) {
    console.error('Get Post Titles Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getPostDetailsById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).select('title content image author category createdAt')
                           .populate('author._id', 'username'); // If `author` is referenced
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Post details fetched successfully',
      post,
    });
  } catch (error) {
    console.error('Get Post Detail Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteAnyPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    // Delete post image from Cloudinary if exists
    if (post.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(post.image.public_id);
      } catch (err) {
        console.warn('Cloudinary image delete error:', err.message);
      }
    }

    // Delete post from DB
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Admin Delete Post Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};