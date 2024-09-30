const Conversation = require('../../models/Conversation');
const User = require('../../models/User');
const Gig = require('../../models/Gig');

const getConversationsByGig = async (req, res) => {
    try {
        const { gigId } = req.params;

        if (!gigId || isNaN(gigId)) {
            return res.status(400).json({ message: 'Invalid gig ID' });
        }

        const conversations = await Conversation.findAll({
            where: { gigId },
            include: [
                { model: User, as: 'buyer', attributes: ['id', 'name', 'profilePicture'] },
                { model: User, as: 'seller', attributes: ['id', 'name', 'profilePicture'] },
                { model: Gig, as: 'gig', attributes: ['id', 'title'] }
            ],
        });

        if (!conversations.length) {
            return res.status(200).json({ message: 'No conversations found for this gig' });
        }

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'An error occurred while fetching conversations' });
    }
};

module.exports = getConversationsByGig;
