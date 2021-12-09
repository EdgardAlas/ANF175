import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Rol = db.define(
	'rol',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		rol: {
			primaryKey: true,
			type: DataTypes.STRING(13),
		},
	},
	{
		tableName: 'rol',
		timestamps: false,
	}
);
