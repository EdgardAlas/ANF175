const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const ZonaDepartamental = db.define(
	'usuario',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		zona: {
			type: DataTypes.STRING(15),
		},
	},
	{
		tableName: 'zona_departamental',
		timestamps: false,
	}
);

module.exports = { ZonaDepartamental };
