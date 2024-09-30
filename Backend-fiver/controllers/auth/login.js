const { Request, Response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const login = async (req, res) => {
    const userData = req.body;

    if (!userData.email || !userData.password) {
        return res.status(400).json({
            message: 'Email and password are required!',
            error: true,
        });
    }

    try {
        const key = parseInt(process.env.KEY || '');
        if (!key) {
            console.error('Key is required!');
            process.exit(1);
        }

        let existingRecord = await User.findOne({ where: { email: userData.email } });
        if (!existingRecord) {
            return res.status(400).json({ message: 'Email or password is incorrect!', error: true });
        }

        let existingUser = existingRecord.dataValues;
        const match = await bcrypt.compare(userData.password, existingUser.password);

        if (!match) {
            return res.status(400).json({ message: 'Email or password is incorrect!', error: true });
        }

        const secret = process.env.SECRET;
        if (!secret) {
            console.error('JWT Secret is required!');
            process.exit(1);
        }

        const user = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
        };

        const token = jwt.sign(user, secret);

        return res.status(200).json({
            message: 'Logged in successfully',
            error: false,
            token,
            blocked: existingUser.blocked,
        });
    } catch (e) {
        console.log('Login Error', e);
        return res.status(500).json({ message: 'Internal Server Error', error: true });
    }
};

module.exports = login;
