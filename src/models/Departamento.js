const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Departamento = db.define(
	'departamento',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		departamento: {
			type: DataTypes.STRING(255),
		},
	},
	{
		tableName: 'departamento',
		timestamps: false,
	}
);

module.exports = { Departamento };
