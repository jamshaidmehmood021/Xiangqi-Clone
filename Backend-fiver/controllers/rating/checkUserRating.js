const Rating = require('../../models/Rating');
const { Op } = require('sequelize');

const checkUserRating = async (req, res) => {
    try {
        const { userId } = req.params; 
        const { role } = req.query; 
        let ratings;

        if (role === 'Seller') {
            ratings = await Rating.findAll({ where: { sellerId: userId, raterId: { [Op.ne]: userId } } });
        } else if (role === 'Buyer') {
            ratings = await Rating.findAll({ where: { buyerId: userId,  raterId: { [Op.ne]: userId } } });
        } else {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (ratings.length > 0) {
           
            const totalRating = ratings.reduce((acc, rating) => acc + parseFloat(rating.dataValues.ratingValue), 0);
            const averageRating = totalRating / ratings.length;

            return res.status(200).json({
                averageRating: averageRating.toFixed(1) 
            });
        }

        return res.status(404).json({
            message: `No ratings found for this user as ${role}`,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = checkUserRating;
