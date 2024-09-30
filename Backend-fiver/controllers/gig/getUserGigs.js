const Gig = require('../../models/Gig');
const User = require('../../models/User');

const getGigsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const gigs = await Gig.findAll({
            where: { userId }, 
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'profilePicture'], 
            },
        });

        if (gigs.length === 0) {
            return res.status(404).json({ message: 'No gigs found for this user.' });
        }

        return res.status(200).json(gigs);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve user gigs', error: error.message });
    }
};

module.exports = getGigsByUserId;
