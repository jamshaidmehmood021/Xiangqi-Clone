const Order = require('../../models/Order');
const { Op } = require('sequelize');

const getOrderById = async (req, res) => {
    const { id } = req.params; 

    try {
        const orders = await Order.findAll({
          where: {
            [Op.or]: [
              { buyerId: id },
              { sellerId: id}
            ]
          }
        });
        return res.json(orders);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

module.exports = getOrderById;
