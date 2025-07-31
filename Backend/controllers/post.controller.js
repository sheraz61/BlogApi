import { Post } from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user._id; // from auth middleware
    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    if(!author){
       return res.status(400).json({ message: "Author required", success: false });
    }
    let postImage = {};
    // Image upload if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts"
      });
      postImage = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }
    const newPost = await Post.create({
      title,
      content,
      category,
      author,
      image: postImage
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

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Update text fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    // Handle image update (only if a new file is uploaded)
    if (req.file && req.file.path) {
      // Delete the old image from Cloudinary (if exists)
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog_posts',
      });
      post.image = {
        url: result.secure_url,
        public_id: result.public_id,
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

    if (post.author.toString() !== userId.toString()) {
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