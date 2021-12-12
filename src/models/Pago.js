const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Pago = db.define(
	'pago',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		monto_cuota: {
			type: DataTypes.FLOAT,
		},
		fecha: {
			type: DataTypes.DATE,
		},
	},
	{
		tableName: 'pago',
		timestamps: false,
	}
);

module.exports = { Pago };
