import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const TipoActivo = db.define(
	'tipo_activo',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		codigo_correlativo: {
			type: DataTypes.STRING(7),
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		clasificacion: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		tableName: 'tipo_activo',
		timestamps: false,
	}
);
