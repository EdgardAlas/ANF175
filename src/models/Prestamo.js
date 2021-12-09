import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Prestamo = db.define(
	'prestamo',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
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
		cartera: {
			type: DataTypes.INTEGER,
		},
		tasa_interes: {
			type: DataTypes.INTEGER,
		},
		gastos_financieros: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'prestamo',
		timestamps: false,
	}
);
