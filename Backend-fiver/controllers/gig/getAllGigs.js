const Gig = require('../../models/Gig');
const User = require('../../models/User');

const getAllGigs = async (req, res) => {
    try {
        const gigs = await Gig.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'profilePicture']
            }
        });

        return res.status(200).json(gigs);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve gigs', error: error.message });
    }
};

module.exports = getAllGigs;
