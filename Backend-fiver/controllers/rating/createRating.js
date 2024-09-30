const Rating = require('../../models/Rating');
const Order = require('../../models/Order');
const User = require('../../models/User');

const createRating = async (req, res) => {
    try {
        const { orderId, ratingValue, buyerId, sellerId,raterId } = req.body;

        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus !== 'Completed') {
            return res.status(400).json({ message: 'Order is not completed yet' });
        }

        const buyer = await User.findByPk(buyerId);
        const seller = await User.findByPk(sellerId);
        if (!buyer || !seller) {
            return res.status(404).json({ message: 'Buyer or Seller not found' });
        }

        const existingRating = await Rating.findOne({ where: { orderId, raterId } });
        if (existingRating) {
            return res.status(400).json({ message: 'Rating already submitted for this order' });
        }

        const rating = await Rating.create({
            orderId,
            ratingValue,
            buyerId,
            sellerId,
            raterId: raterId,
        });

        res.status(201).json({ message: 'Rating submitted successfully', rating });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = createRating;
