const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const TipoCuenta = db.define(
	'tipo_cuenta',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		tipo_cuenta: {
			type: DataTypes.STRING(30),
		},
	},
	{
		tableName: 'tipo_cuenta',
		timestamps: false,
	}
);

module.exports = { TipoCuenta };
