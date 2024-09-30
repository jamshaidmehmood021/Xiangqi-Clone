const Gig = require('../../models/Gig');

const deleteGig = async (req, res) => {
    try {
        const { id } = req.params;
        
        const gig = await Gig.findByPk(id);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
    
        await gig.destroy();
        return res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete gig', error: error.message });
    }
};

module.exports = deleteGig;
