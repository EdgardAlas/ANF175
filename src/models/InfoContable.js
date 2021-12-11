const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const InfoContable = db.define(
	'info_contable',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		saldo: {
			type: DataTypes.FLOAT,
		},
		anio: {
			type: DataTypes.INTEGER,
		},
		tipo_cuenta: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'info_contable',
		timestamps: false,
	}
);

module.exports = { InfoContable };
