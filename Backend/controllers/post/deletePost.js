const Post = require('../../models/Post');

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Post.destroy({
            where: { id: id }
        });

        if (result) {
            return res.status(200).json({
                message: 'Post deleted successfully.',
                error: false,
            });
        } else {
            return res.status(404).json({
                message: 'Post not found.',
                error: true,
            });
        }
    } catch (e) {
        console.error('DeletePost Error:', e);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
};

module.exports = deletePost;
