const { sequelize } = require('../lib/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Gig = require('./Gig');

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    gigId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gig,
            key: 'id',
        },
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

Gig.hasMany(Conversation, { foreignKey: 'gigId' });
Conversation.belongsTo(Gig, { foreignKey: 'gigId', as: 'gig' });

User.hasMany(Conversation, { foreignKey: 'buyerId', as: 'buyerConversations' });
User.hasMany(Conversation, { foreignKey: 'sellerId', as: 'sellerConversations' });

Conversation.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Conversation.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = Conversation;
