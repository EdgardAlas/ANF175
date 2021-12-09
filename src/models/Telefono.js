import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Telefono = db.define(
	'telefono',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
		cliente: {
			type: DataTypes.STRING(36),
		},
	},
	{
		tableName: 'telefono',
		timestamps: false,
	}
);
