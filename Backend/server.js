const express = require('express');
const authRoutes = require('./routes/auth/auth');
require('./configs/passport');
const { sequelize } = require('./lib/sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', authRoutes);

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Models have been synchronized!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
