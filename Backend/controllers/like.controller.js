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
        if (user.likes.includes(postId) && post.likes.includes(userId)) {
            await User.findByIdAndUpdate(userId, { $pull: { likes: postId } })
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } })
            return res.status(200).json({ success: true, message: 'Liked removed successfully' });
        } else {
            await User.findByIdAndUpdate(userId, { $push: { likes: postId } })
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } })
            return res.status(200).json({ success: true, message: 'Post Like successfully' });
        }
    } catch (error) {
        console.error('Toggle Like Error:', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
