require('dotenv').config();

module.exports = {
	port: process.env.PORT || 5000,
	db_port: process.env.DB_PORT || 3306,
	db_usuario: process.env.DB_USUARIO || 'root',
	db_password: process.env.DB_PASSWORD || '',
	db_name: process.env.DB_NAME || 'anf175',
	db_host: process.env.DB_HOST || 'localhost',
	db_dialect: process.env.DB_DIALECT || 'mysql',
	session_key: process.env.SESSION_KEY || 'abc',
	jwt_key: process.env.JWT_KEY || 'abc',
	maxAge: 10800000,
};
