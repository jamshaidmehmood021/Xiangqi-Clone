const User  = require('../../models/User');
const Post = require('../../models/Post');

const addPost = async (req, res) => {
    const { caption, date, description, image, email } = req.body;

    if (!caption || !date || !description || !image || !email) {
        return res.status(400).json({
            message: 'All fields are required! None of the form fields should be empty',
            error: true,
        });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found', error: true });
        }

        const post = await Post.create({
            caption,
            date,
            description,
            image,
            userId: user.id, 
        });

        return res.status(200).json({ message: 'Post added successfully.', error: false });
    } catch (e) {
        console.error('AddPost Error', e);
        return res.status(500).json({ message: 'Internal Server Error', error: true });
    }
};

module.exports = addPost;
