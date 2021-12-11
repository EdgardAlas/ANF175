const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Vehiculo = db.define(
	'vehiculo',
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
		marca: {
			type: DataTypes.STRING(50),
		},
		modelo: {
			type: DataTypes.STRING(50),
		},
		anio: {
			type: DataTypes.INTEGER,
		},
		direccion: {
			type: DataTypes.STRING(255),
		},
		valor: {
			type: DataTypes.FLOAT,
		},
		archivo_compra: {
			type: DataTypes.STRING(100),
		},
	},
	{
		tableName: 'vehiculo',
		timestamps: false,
	}
);

module.exports = { Vehiculo };
