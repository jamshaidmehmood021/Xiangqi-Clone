const Post = require('../../models/Post');
const User = require('../../models/User');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] 
        });
        
        if (posts.length > 0) {
            return res.status(200).json(posts);
        } else {
            return res.status(404).json({
                message: 'No posts found.',
                error: true,
            });
        }
    } catch (e) {
        console.error('GetPosts Error:', e);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        });
    }
};

module.exports = getPosts;
