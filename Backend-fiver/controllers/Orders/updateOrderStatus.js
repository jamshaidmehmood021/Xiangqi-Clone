const Order = require('../../models/Order');

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const io = req.app.get('socketio');

        if (!io) {
            return res.status(500).json({ error: 'Socket.io is not initialized' });
        }

        const validStatuses = ['Pending', 'In Progress', 'Completed', 'Declined'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = orderStatus;
        await order.save();

        if(order) {
            io.to(order.dataValues.sellerId).emit('statusUpdate', {
                status: order.dataValues.status
            });
        }

        return res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports =  updateOrderStatus;
