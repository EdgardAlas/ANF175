const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const InfoContable = db.define(
	'info_contable',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		saldo: {
			type: DataTypes.FLOAT,
		},
		anio: {
			type: DataTypes.INTEGER,
		},
		codigo: {
			type: DataTypes.UUID,
		},
	},
	{
		tableName: 'info_contable',
		timestamps: false,
	}
);

module.exports = { InfoContable };
