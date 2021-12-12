const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Cartera = db.define(
	'cartera',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		incobrable: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		tableName: 'cartera',
		timestamps: false,
	}
);

module.exports = { Cartera };
