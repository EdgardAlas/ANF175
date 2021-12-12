const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Telefono = db.define(
	'telefono',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
	},
	{
		tableName: 'telefono',
		timestamps: false,
	}
);

module.exports = { Telefono };
