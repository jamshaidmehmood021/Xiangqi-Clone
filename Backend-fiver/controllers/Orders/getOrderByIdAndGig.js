const Order = require('../../models/Order');
const { Op } = require('sequelize');

const getOrderByIdAndGig = async (req, res) => {
    const { id } = req.params;
    const { gigId } = req.body; 
    try {
        const orders = await Order.findAll({
            where: {
                buyerId: id, 
                gigId: gigId, 
                orderStatus: {
                    [Op.ne]: 'Completed', 
                }
            }
        });
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this buyer and gig combination.' });
        }
        
        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = getOrderByIdAndGig;
