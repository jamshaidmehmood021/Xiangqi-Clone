const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/sequelize'); 
const User = require('./User');

const Post = sequelize.define('Post', {
    caption: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });


module.exports = Post;
