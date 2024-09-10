const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/sequelize');
const User = require('./User');
const Post = require('./Post');

const Like = sequelize.define('Like', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    timestamps: true,
});

User.belongsToMany(Post, { through: Like, as: 'likedPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: Like, as: 'likedBy', foreignKey: 'postId' });

module.exports = Like;
