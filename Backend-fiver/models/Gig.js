const { sequelize } = require('../lib/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Gig = sequelize.define('Gig', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT, 
        allowNull: true,
    },
    video: {
        type: DataTypes.BLOB('long'), 
        allowNull: true,
    },
    userId: {
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

Gig.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Gig;
