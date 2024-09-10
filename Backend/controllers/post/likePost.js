const Like = require('../../models/Like');
const Post = require('../../models/Post');

const likePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const alreadyLiked = await Like.findOne({ where: { userId, postId } });
        if (alreadyLiked) {
            return res.status(400).json({ error: 'Post already liked' });
        }

        await Like.create({ userId, postId });

        return res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while liking the post' });
    }
};

module.exports = likePost;
