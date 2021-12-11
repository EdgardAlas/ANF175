const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Activo = db.define(
	'activo',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		tipo_adquisicion: {
			type: DataTypes.BOOLEAN,
		},
		nombre_activo: {
			type: DataTypes.STRING(100),
		},
		marca: {
			type: DataTypes.STRING(30),
		},
		modelo: {
			type: DataTypes.STRING(30),
		},
		serie: {
			type: DataTypes.STRING(30),
		},
		fecha_adquisicion: {
			type: DataTypes.DATE,
		},
		valor_adquisicion: {
			type: DataTypes.FLOAT,
		},
		estado_adquisicion: {
			type: DataTypes.BOOLEAN,
		},
		ubicacion: {
			type: DataTypes.STRING(50),
		},
	},
	{
		tableName: 'activo',
		timestamps: false,
	}
);

module.exports = { Activo };
