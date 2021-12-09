import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Baja = db.define(
	'baja',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		motivo: {
			type: DataTypes.STRING(255),
		},
		observacion: {
			type: DataTypes.STRING(255),
		},
		fecha_baja: {
			type: DataTypes.DATE,
		},
		activo: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'baja',
		timestamps: false,
	}
);
