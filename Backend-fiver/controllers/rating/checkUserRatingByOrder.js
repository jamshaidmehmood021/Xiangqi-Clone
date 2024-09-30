const Rating = require('../../models/Rating');
const Order = require('../../models/Order');

const checkUserRatingByOrder = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const { userId, role } = req.query; 
        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        let rating;
        if (role === 'Seller') {
            rating = await Rating.findOne({ where: { orderId, sellerId: userId,raterId: userId  } });
        } else if (role === 'Buyer') {
            rating = await Rating.findOne({ where: { orderId, buyerId: userId,raterId: userId  } });
        } else {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (rating) {
            return res.json({
                message: 'Rating exists for this user on this order',
                role: role,
                rating: rating.ratingValue
            });
        }

        return res.json({
            message: 'No rating found for this user on this order',
        });
    } catch (error) {
        console.error('Error checking user rating:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = checkUserRatingByOrder;
