 const { Sequelize } = require('sequelize');

 const dotenv = require('dotenv');
 const pg = require('pg');
 dotenv.config()

// const db_name = process.env.DB_NAME;
// const username = process.env.DB_USER;
// const host = process.env.DB_HOST || 'localhost';
// const port = parseInt(process.env.DB_PORT || '5432', 10);

// if (!db_name || !username) {
//     console.error('Database name and Username are required!');
//     process.exit(1);
// }

// const sequelize = new Sequelize(db_name, username, '', {
//     host,
//     port,
//     dialect: 'postgres',
// });

const sequelize = new Sequelize(process.env.SUPABASE_URL,
    {    dialectModule: pg,
    }
);

module.exports = { sequelize };
