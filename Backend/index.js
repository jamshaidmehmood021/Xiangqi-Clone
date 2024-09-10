const express = require('express');
const authRoutes = require('./routes/auth/auth');
require('./configs/passport');
const { sequelize } = require('./lib/sequelize');
const cors = require('cors')


const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));


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
