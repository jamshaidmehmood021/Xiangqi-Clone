const { ExtractJwt, Strategy } = require('passport-jwt');
const passport = require('passport');
const { User } = require('../models/User');

if (!process.env.SECRET) {
    console.error('SECRET is required for Passport JS');
    process.exit(1);
}

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
};

passport.use(
    new Strategy(options, async (payload, done) => {
        try {
            const record = await User.findOne({ where: { id: payload.id } });
            if (record) return done(null, record.dataValues);
            return done(null, false); // If no record found, return false
        } catch (e) {
            console.log('Error in passport config');
            return done(e);
        }
    })
);
