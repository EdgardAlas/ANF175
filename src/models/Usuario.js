import { DataTypes } from 'sequelize/dist';
import { db } from '../../database/db';

export const Usuario = db.define(
	'usuario',
	{
		id: {
			primaryKey: true,
			type: DataTypes.STRING(36),
		},
		correo_electronico: {
			type: DataTypes.STRING(255),
		},
		clave: {
			type: DataTypes.STRING(80),
		},
		nombre: {
			type: DataTypes.STRING(255),
		},
		estado_usuario: {
			type: DataTypes.BOOLEAN,
		},
		rol: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'usuario',
		timestamps: false,
	}
);
