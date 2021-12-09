import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Departamento = db.define(
	'departamento',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		departamento: {
			type: DataTypes.STRING(255),
		},
	},
	{
		tableName: 'departamento',
		timestamps: false,
	}
);
