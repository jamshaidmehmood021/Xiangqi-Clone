const Post = require('../../models/Post');
const User = require('../../models/User');

const getPostsByUser = async (req, res) => {
    const { email } = req.query; 
    try {
        const user = await User.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'email']
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
            });
        }
        const posts = await Post.findAll({
            where: { userId: user.id },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        if (posts.length > 0) {
            return res.status(200).json(posts);
        } else {
            return res.status(404).json({
                message: 'No posts found for this user.',
                error: true,
            });
        }
    } catch (e) {
        console.error('GetPostsByUser Error:', e);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
};

module.exports = getPostsByUser;
