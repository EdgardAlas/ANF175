const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Usuario = db.define(
	'usuario',
	{
		id: {
			primaryKey: true,
			type: DataTypes.STRING(36),
		},
		correo_electronico: {
			type: DataTypes.STRING(255),
		},
		clave: {
			type: DataTypes.STRING(80),
		},
		usuario: {
			type: DataTypes.STRING(255),
		},
		estado_usuario: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		tableName: 'usuario',
		timestamps: false,
	}
);

module.exports = { Usuario };
