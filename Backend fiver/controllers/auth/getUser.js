const User = require('../../models/User');

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, email, role, profilePicture } = user;
        res.status(200).json({ name, email, role, profilePicture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = getUser;
