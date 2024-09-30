const Order = require('../../models/Order');

const getAllOrder = async (req, res) => {

    try {
        const orders = await Order.findAll();
        return res.json(orders);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

module.exports = getAllOrder;
