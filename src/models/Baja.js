const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Baja = db.define(
	'baja',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		motivo: {
			type: DataTypes.STRING(255),
		},
		observacion: {
			type: DataTypes.STRING(255),
		},
		fecha_baja: {
			type: DataTypes.DATE,
		},
	},
	{
		tableName: 'baja',
		timestamps: false,
	}
);

module.exports = { Baja };
