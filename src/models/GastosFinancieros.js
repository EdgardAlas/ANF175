const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const GastosFinancieros = db.define(
	'gastos_financieros',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		monto: {
			type: DataTypes.FLOAT,
		},
	},
	{
		tableName: 'gastos_financieros',
		timestamps: false,
	}
);

module.exports = { GastosFinancieros };
