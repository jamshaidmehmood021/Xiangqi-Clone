const Conversation = require('../../models/Conversation');
const Message = require('../../models/Messages');

async function getMessages(req, res) {
    const { conversationId } = req.params;

    try {

        const conversation = await Conversation.findByPk(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        const messages = await Message.findAll({ where: { conversationId } });

        res.status(200).json({
            conversation,
            messages,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
}

module.exports = getMessages;
