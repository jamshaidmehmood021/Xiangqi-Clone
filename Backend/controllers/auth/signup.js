const { Request, Response } = require('express');
const { encrypt } = require('@omar-sarfraz/caesar-cipher');
const bcrypt = require('bcrypt');

const { User } = require('../../models/User');

const signup = async (req, res) => {
    const userData = req.body;

    if (!userData.email || !userData.firstName || !userData.lastName || !userData.password) {
        return res.status(400).json({
            message: 'firstName, lastName, email, and password are required!',
            error: true,
        });
    }

    try {
        const key = parseInt(process.env.KEY || '', 10);
        if (!key) {
            console.error('Key is required!');
            process.exit(1);
        }

        const encryptedEmail = encrypt(key, userData.email);

        const existingUser = await User.findOne({ where: { email: encryptedEmail } });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists', error: true });
        }

        const hash = await bcrypt.genSalt(key);
        const encryptedPassword = await bcrypt.hash(userData.password, hash);
        console.log("before")
        const user = await User.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: encryptedEmail,
            password: encryptedPassword,
        });
        console.log("after")
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
