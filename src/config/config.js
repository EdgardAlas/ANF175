require('dotenv').config();

module.exports = {
	port: process.env.PORT || 5000,
	DB_PORT: process.env.DB_PORT || 3306,
	DB_USUARIO: process.env.DB_USUARIO || 'root',
	DB_PASSWORD: process.env.DB_PASSWORD || '',
	DB_NAME: process.env.DB_NAME || '',
	DB_HOST: process.env.DB_HOST || 'localhost',
};
