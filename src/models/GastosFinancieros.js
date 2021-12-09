import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const GastosFinancieros = db.define(
	'gastos_financieros',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		monto: {
			type: DataTypes.FLOAT,
		},
	},
	{
		tableName: 'gastos_financieros',
		timestamps: false,
	}
);
