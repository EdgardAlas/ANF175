import { Sequelize } from 'sequelize';
import config from '../config/config';

export const db = new Sequelize({
	dialect: config.db_dialect,
	host: config.db_usuario,
	username: config.username,
	password: config.db_password,
	port: config.db_port,
	database: config.db_name,
	logging: true,
});
