const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Cliente = db.define(
	'cliente',
	{
		id: {
			primaryKey: true,
			type: DataTypes.STRING(36),
			defaultValue: DataTypes.UUIDV4,
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		nit: {
			type: DataTypes.STRING(18),
		},
		codigo_cliente: {
			type: DataTypes.STRING(7),
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		apellido: {
			type: DataTypes.STRING(255),
		},
		correo_electronico: {
			type: DataTypes.STRING(255),
		},
		direccion: {
			type: DataTypes.STRING(255),
		},
		estado_civil: {
			type: DataTypes.BOOLEAN,
		},
		tipo_empleo: {
			type: DataTypes.BOOLEAN,
		},
		tipo_cliente: {
			type: DataTypes.BOOLEAN,
		},
		ingresos: {
			type: DataTypes.FLOAT,
		},
		fecha_nacimiento: {
			type: DataTypes.DATE,
		},
		archivo_constancia_laboral: {
			type: DataTypes.STRING(200),
		},
	},
	{
		tableName: 'cliente',
		timestamps: false,
	}
);

module.exports = { Cliente };
