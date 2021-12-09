import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const InfoContable = db.define(
	'info_contable',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		saldo: {
			type: DataTypes.FLOAT,
		},
		anio: {
			type: DataTypes.INTEGER,
		},
		cliente: {
			type: DataTypes.STRING(36),
		},
		tipo_cuenta: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'info_contable',
		timestamps: false,
	}
);
