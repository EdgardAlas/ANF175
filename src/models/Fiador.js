const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Fiador = db.define(
	'fiador',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		direccion: {
			type: DataTypes.STRING(255),
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
		tipo_empleo: {
			type: DataTypes.BOOLEAN,
		},
		lugar_trabajo: {
			type: DataTypes.STRING(255),
		},
		ingresos: {
			type: DataTypes.FLOAT,
		},
		archivo_const_laboral: {
			type: DataTypes.STRING(100),
		},
	},
	{
		tableName: 'fiador',
		timestamps: false,
	}
);

module.exports = { Fiador };
