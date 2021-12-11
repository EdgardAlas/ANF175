const { Sequelize } = require('sequelize');
const config = require('../config/config');

const db = new Sequelize({
	dialect: config.db_dialect,
	host: config.db_host,
	username: config.db_usuario,
	password: config.db_password,
	port: config.db_port,
	database: config.db_name,
	logging: true,
});

module.exports = { db };
