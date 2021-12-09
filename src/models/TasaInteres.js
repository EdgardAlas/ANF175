import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const TasaInteres = db.define(
	'tasa_interes',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		porcentaje: {
			type: DataTypes.FLOAT,
		},
	},
	{
		tableName: 'tasa_interes',
		timestamps: false,
	}
);
