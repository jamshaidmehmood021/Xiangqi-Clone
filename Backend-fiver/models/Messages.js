const { sequelize } = require('../lib/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Conversation = require('./Conversation');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Conversation,
            key: 'id',
        },
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
User.hasMany(Message, { foreignKey: 'senderId' });

module.exports = Message;
