const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Municipio = db.define(
	'municipio',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		municipio: {
			type: DataTypes.STRING(255),
		},
	},
	{
		tableName: 'municipio',
		timestamps: false,
	}
);

module.exports = { Municipio };
