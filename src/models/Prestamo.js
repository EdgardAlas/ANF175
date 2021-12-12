const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Prestamo = db.define(
	'prestamo',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
		},
		monto: {
			type: DataTypes.FLOAT,
		},
		duracion: {
			type: DataTypes.INTEGER,
		},
		dia_pago: {
			type: DataTypes.INTEGER,
		},
		fecha_aprobacion: {
			type: DataTypes.DATE,
		},
		valor_cuota: {
			type: DataTypes.FLOAT,
		},
		valor_total: {
			type: DataTypes.FLOAT,
		},
	},
	{
		tableName: 'prestamo',
		timestamps: false,
	}
);

module.exports = { Prestamo };
