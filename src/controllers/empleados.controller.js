const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const { db } = require('../database/db');
const { Empleado } = require('../models/Empleado');
const { Rol } = require('../models/Rol');

const registrarEmpleado = async (req, res) => {
	try {
		const { dui, nombre, telefono, correo, usuario, clave } = req.body;

		let empleado = null;
		await db.transaction(async (t) => {
			empleado = await Empleado.create(
				{
					dui,
					nombre,
					telefono,
					correo_electronico: correo,
					usuario,
					clave,
					rol_fk: 3,
				},
				{ transaction: t }
			);
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el empleado',
			empleado,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerEmpleados = async (req, res) => {
	try {
		const empleados = await Empleado.findAll({
			attributes: [
				'dui',
				'id',
				'nombre',
				'correo_electronico',
				'usuario',
				'telefono',
			],
			include: [
				{
					model: Rol,
					attributes: ['rol'],
					where: {
						[Op.not]: {
							rol: 'Administrador',
						},
					},
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			empleados,
		});
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	registrarEmpleado,
	obtenerEmpleados,
};
