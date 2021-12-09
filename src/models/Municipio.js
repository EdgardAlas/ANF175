import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Municipio = db.define(
	'municipio',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		municipio: {
			type: DataTypes.STRING(255),
		},
		departamento: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'municipio',
		timestamps: false,
	}
);
