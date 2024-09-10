const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/sequelize');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = Comment;
