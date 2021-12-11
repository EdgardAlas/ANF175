const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Hipoteca = db.define(
	'hipoteca',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		longitud: {
			type: DataTypes.FLOAT,
		},
		latitud: {
			type: DataTypes.FLOAT,
		},
		altitud: {
			type: DataTypes.FLOAT,
		},
		tamanio: {
			type: DataTypes.FLOAT,
		},
		zona: {
			type: DataTypes.BOOLEAN,
		},
		direccion: {
			type: DataTypes.STRING(255),
		},
		valor: {
			type: DataTypes.FLOAT,
		},
		archivo_escritura: {
			type: DataTypes.STRING(100),
		},
	},
	{
		tableName: 'hipoteca',
		timestamps: false,
	}
);

module.exports = { Hipoteca };
