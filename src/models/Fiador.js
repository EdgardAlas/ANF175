import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Fiador = db.define(
	'fiador',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		dui: {
			type: DataTypes.STRING(10),
		},
		direccion: {
			type: DataTypes.STRING(255),
		},
		telefono: {
			type: DataTypes.STRING(9),
		},
		tipo_empleo: {
			type: DataTypes.BOOLEAN,
		},
		lugar_trabajo: {
			type: DataTypes.STRING(255),
		},
		ingresos: {
			type: DataTypes.FLOAT,
		},
		archivo_const_laboral: {
			type: DataTypes.STRING(100),
		},
		cliente: {
			type: DataTypes.STRING(36),
		},
	},
	{
		tableName: 'fiador',
		timestamps: false,
	}
);
