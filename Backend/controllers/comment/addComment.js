const Comment = require('../../models/Comment');
const User = require('../../models/User'); 

const addComment = async (req, res) => {
    const { postId, text, userId } = req.body;
    try {
        const comment = await Comment.create({
            text,
            postId,
            userId,
        });

        const user = await User.findByPk(userId);
        return res.status(201).json({
            ...comment.toJSON(),
            userName: user ? user.name : null,
            userEmail: user ? user.email : null
        });
    } catch (error) {
        console.error('AddComment Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: true });
    }
};

module.exports = addComment;
