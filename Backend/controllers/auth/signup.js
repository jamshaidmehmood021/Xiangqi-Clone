const { Request, Response } = require('express');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

const signup = async (req, res) => {
    const userData = req.body;

    if (!userData.email || !userData.name || !userData.password) {
        return res.status(400).json({
            message: 'name, email, and password are required!',
            error: true,
        });
    }

    try {
        const key = parseInt(process.env.KEY || '', 10);
        if (!key) {
            console.error('Key is required!');
            process.exit(1);
        }
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists', error: true });
        }

        const hash = await bcrypt.genSalt(key);
        const encryptedPassword = await bcrypt.hash(userData.password, hash);
        const user = await User.create({
            name: userData.name,
            email: userData.email,
            password: encryptedPassword,
        });

        if (user) {
            return res.status(200).json({ message: 'User added successfully.', error: false });
        } else {
            return res.status(400).json({ message: 'Failed to add user', error: true });
        }
    } catch (e) {
        console.log('SignUp Error', e);
        return res.status(500).json({ message: 'Internal Server Error', error: true });
    }
};

module.exports = signup;
