const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const { db } = require('../database/db');
const { hashClave } = require('../helpers/hash-clave');
const { Empleado } = require('../models/Empleado');
const { Rol } = require('../models/Rol');

const registrarEmpleado = async (req, res) => {
	try {
		const { dui, nombre, telefono, correo, usuario, clave } = req.body;

		let empleado = null;

		const hash = await hashClave(clave);

		await db.transaction(async (t) => {
			empleado = await Empleado.create(
				{
					dui,
					nombre,
					telefono,
					correo_electronico: correo,
					usuario,
					clave: hash,
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

const editarEmpleado = async (req, res) => {
	try {
		const { dui, nombre, telefono, correo, usuario, clave } = req.body;
		const { id } = req.params;

		const hash = await hashClave(clave);

		await db.transaction(async (t) => {
			if (clave !== undefined || clave.length > 0) {
				await Empleado.update(
					{
						dui,
						nombre,
						telefono,
						correo_electronico: correo,
						usuario,
						clave: hash,
					},
					{
						transaction: t,
						where: {
							id,
						},
					}
				);
			} else {
				await Empleado.update(
					{
						dui,
						nombre,
						telefono,
						correo_electronico: correo,
						usuario,
					},
					{
						transaction: t,
						where: {
							id,
						},
					}
				);
			}
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha editado con exito el empleado',
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

const existeCorreo = async (req, res) => {
	const { id } = req.query;
	const { correo: correo_electronico } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Empleado.findOne({
				where: {
					correo_electronico,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Empleado.findOne({
				where: {
					correo_electronico,
				},
			});
		}
		return res.status(StatusCodes.OK).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};

const existeDUI = async (req, res) => {
	const { id } = req.query;
	const { dui } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Empleado.findOne({
				where: {
					dui,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Empleado.findOne({
				where: {
					dui,
				},
			});
		}
		return res.status(StatusCodes.OK).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};
const existeUsuario = async (req, res) => {
	const { id } = req.query;
	const { usuario } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Empleado.findOne({
				where: {
					usuario,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Empleado.findOne({
				where: {
					usuario,
				},
			});
		}
		return res.status(StatusCodes.OK).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	registrarEmpleado,
	editarEmpleado,
	obtenerEmpleados,
	existeCorreo,
	existeDUI,
	existeUsuario,
};
