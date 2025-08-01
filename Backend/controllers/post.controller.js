import { Post } from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";
import {User} from '../models/user.model.js'
export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user; // from auth middleware
    const user=await User.findById(userId).select('-name -password -likes -bookmarks -isVerified -role -bio -__v -email -loginHistory -resetPassword -emailVerification')
    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    if(!user){
       return res.status(404).json({ message: "User Not Found", success: false });
    }
    let postImage = {};
    // Image upload if exists
    if (req.file) {
      postImage = {
        url: req.file.path, // already secure_url from multer-cloudinary
        public_id: req.file.filename, // this is public_id from Cloudinary
      };
    }
    const newPost = await Post.create({
      title,
      content,
      category,
      author:{
        _id: user._id,
        username: user.username,
      },
      image:{
        url:postImage?.url,
        public_id:postImage?.public_id
      }
    });

    res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { title, content, category } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author?._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Update text fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    // Handle image update (only if a new file is uploaded)
    if (req.file) {
      // Delete the old image from Cloudinary (if exists)
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      post.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // From isAuth middleware
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (post.author?._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
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
    console.error('Delete Post Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 }) // latest posts first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      message:"All post fetch  successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      posts,
    });
  } catch (error) {
    console.error("Get All Posts Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({
      message:"Post fetch successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get Post By ID Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
