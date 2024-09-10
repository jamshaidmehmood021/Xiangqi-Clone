const Post = require('../../models/Post');
const User = require('../../models/User');

const getLikesInfo = async (req, res) => {
  try {
    const { postId } = req.query; 
    
    if (postId) {
      const postWithLikes = await Post.findByPk(postId, {
        include: {
          model: User,
          as: 'likedBy',
          attributes: ['id', 'name', 'email'] 
        }
      });

      if (!postWithLikes) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const response = {
        post: {
          id: postWithLikes.id,
          caption: postWithLikes.caption,
          image: postWithLikes.image,
          description: postWithLikes.description,
          date: postWithLikes.date
        },
        likedBy: postWithLikes.likedBy.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email
        }))
      };

      return res.status(200).json(response);
    }

    return res.status(400).json({ message: 'postId must be provided' });
  } catch (error) {
    console.error('Error fetching liked information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getLikesInfo;
