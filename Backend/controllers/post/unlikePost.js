const Like = require('../../models/Like');
const Post = require('../../models/Post');

const unlikePost = async (req, res) => {
    try {
        const { postId, userId } = req.query;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const like = await Like.findOne({ where: { userId, postId } });
        if (!like) {
            return res.status(400).json({ error: 'Post not liked' });
        }
        
        await Like.destroy({ where: { userId, postId } });

        return res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while unliking the post' });
    }
};

module.exports = unlikePost;
