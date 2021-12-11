const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Empleado = db.define(
	'empleado',
	{
		id: {
			primaryKey: true,
			type: DataTypes.STRING(36),
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
		estado_empleado: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		tableName: 'empleado',
		timestamps: false,
	}
);

module.exports = {
	Empleado,
};
