const { sequelize } = require('../lib/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Gig = require('./Gig');

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gigId: {
        type: DataTypes.INTEGER,
        references: {
            model: Gig,
            key: 'id',
        },
        allowNull: false,
    },
    buyerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    }
}, {
    timestamps: true,
});

Order.belongsTo(Gig, { foreignKey: 'gigId' });
Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Order.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

module.exports = Order;
