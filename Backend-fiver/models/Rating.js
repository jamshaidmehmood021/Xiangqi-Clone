const { sequelize } = require('../lib/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Order = require('./Order');

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ratingValue: {
        type: DataTypes.DECIMAL(2, 1), 
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
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'orderId',
        },
        allowNull: false,
    },
    raterId:{
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    }
}, {
    timestamps: true,
});

Rating.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Rating.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
Rating.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Rating;
