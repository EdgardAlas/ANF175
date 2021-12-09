import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Cartera = db.define(
	'cartera',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		incobrable: {
			type: DataTypes.BOOLEAN,
		},
		cliente: {
			type: DataTypes.STRING(36),
		},
		empleado: {
			type: DataTypes.STRING(36),
		},
	},
	{
		tableName: 'cartera',
		timestamps: false,
	}
);
