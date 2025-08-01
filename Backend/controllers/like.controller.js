import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ success: false, message: 'post not found' });
        }
        const isLiked = user.likes?.includes(postId);
        if (isLiked) {
            user.likes = user.likes.filter(id => id.toString() !== postId);
            await user.save();
            return res.status(200).json({ success: true, message: 'Like removed successfully' });
        } else {
            user.likes = user.likes || []; // in case the field doesn't exist yet
            user.likes.push(postId);
            await user.save();
            return res.status(200).json({ success: true, message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error('Toggle Like Error:', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
