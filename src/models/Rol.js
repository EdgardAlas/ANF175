const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Rol = db.define(
	'rol',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		rol: {
			type: DataTypes.STRING(13),
		},
	},
	{
		tableName: 'rol',
		timestamps: false,
	}
);

module.exports = { Rol };
