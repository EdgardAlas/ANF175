const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const TasaInteres = db.define(
	'tasa_interes',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		porcentaje: {
			type: DataTypes.FLOAT,
		},
	},
	{
		tableName: 'tasa_interes',
		timestamps: false,
	}
);

module.exports = { TasaInteres };
