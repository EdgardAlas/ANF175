import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const TipoCuenta = db.define(
	'tipo_cuenta',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		tipo_cuenta: {
			type: DataTypes.STRING(30),
		},
	},
	{
		tableName: 'tipo_cuenta',
		timestamps: false,
	}
);
