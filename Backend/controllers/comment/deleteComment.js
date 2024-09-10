const Comment  = require('../../models/Comment');

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Comment.destroy({
            where: { id: id }
        });

        if (result) {
            return res.status(200).json({
                message: 'Comment deleted successfully.',
                error: false,
            });
        } else {
            return res.status(404).json({
                message: 'Comment not found.',
                error: true,
            });
        }
    } catch (e) {
        console.error('DeleteComment Error:', e);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
};

module.exports = deletePost;
