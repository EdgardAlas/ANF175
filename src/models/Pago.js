import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Pago = db.define(
	'pago',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		monto_cuota: {
			type: DataTypes.FLOAT,
		},
		fecha: {
			type: DataTypes.DATE,
		},
		prestamo: {
			type: DataTypes.INTEGER,
		},
		empleado: {
			type: DataTypes.STRING(36),
		},
	},
	{
		tableName: 'pago',
		timestamps: false,
	}
);
