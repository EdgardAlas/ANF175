import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Empleado = db.define(
	'empleado',
	{
		id: {
			primaryKey: true,
			type: DataTypes.STRING(36),
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
		estado_empleado: {
			type: DataTypes.BOOLEAN,
		},
		usuario: {
			type: DataTypes.STRING(36),
		},
	},
	{
		tableName: 'empleado',
		timestamps: false,
	}
);
