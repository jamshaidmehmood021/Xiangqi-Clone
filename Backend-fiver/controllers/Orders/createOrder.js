const Order = require('../../models/Order');
const Gig = require('../../models/Gig');
const User = require('../../models/User');
const { Op } = require('sequelize');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.PROJ_API, process.env.PROJ_KEY);

const uploadFile = async (filePath, fileName) => {
  try {
    const file = fs.readFileSync(filePath + fileName);
    const { data, error } = await supabase.storage
      .from('uploads') 
      .upload(fileName, file, { contentType: 'any'}); 

    if (error) {
      throw error;
    }

    const { data: response, error: urlError } = supabase
      .storage
      .from('uploads')
      .getPublicUrl(fileName);

    if (urlError) {
      throw urlError;
    }

    return response.publicUrl;
  } catch (err) {
    console.error('Error uploading file to Supabase:', err.message);
    return null;
  }
};

const createOrder = async (req, res) => {
    try {
        const io = req.app.get('socketio');

        if (!io) {
            return res.status(500).json({ error: 'Socket.io is not initialized' });
        }

        const { gigId, buyerId, sellerId, deadline, amount,file } = req.body;

        const [buyer, seller] = await Promise.all([
            User.findByPk(buyerId),
            User.findByPk(sellerId)
        ]);

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found.' });
        }

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found.' });
        }

        const existingOrder = await Order.findOne({
            where: {
                gigId,
                buyerId,
                orderStatus: {
                    [Op.ne]: 'Completed',
                }
            }
        });

        if (existingOrder) {
            return res.status(400).json({ message: 'You already have an active order on this gig.' });
        }

        let fileUrl = null;
        if (file) {
            const filePath = process.env.MULTER_PATH;
            const fileName = file;
            fileUrl = await uploadFile(filePath, fileName);
            console.log(fileUrl);
        }

        const newOrder = await Order.create({
            gigId,
            buyerId,
            sellerId,
            deadline,
            amount,
            orderStatus: 'Pending',
            filePath: fileUrl 
        });

        if (newOrder) {
            io.to(sellerId).emit('newOrder', {
                newOrder
            });
        }

        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Create Order Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports =  createOrder;
