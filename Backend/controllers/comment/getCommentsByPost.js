const Comment  = require('../../models/Comment');
const User = require('../../models/User');

const getCommentsByPost = async (req, res) => {
    const { postId } = req.query;

    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        });

        return res.status(200).json(comments);
    } catch (error) {
        console.error('GetCommentsByPost Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: true });
    }
};
module.exports = getCommentsByPost;
