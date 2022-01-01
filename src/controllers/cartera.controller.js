const { StatusCodes } = require('http-status-codes');
const { Empleado } = require('../models/Empleado');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Vehiculo } = require('../models/Vehiculo');
const { Hipoteca } = require('../models/Hipoteca');
const { db } = require('../database/db');

const obtenerCartera = async (req, res) => {
	try {
		const cartera = await Cartera.findAll({
			attributes: ['id', 'incobrable', 'cliente_fk', 'empleado_fk'],
			include: [
				{
					model: Cliente,
					attributes: ['id', 'nombre', 'apellido'],
					required: true,
					include: [
						{
							model: Vehiculo,
							attributes: ['id'],
						},
						{
							model: Hipoteca,
						},
					],
				},

				{
					model: Empleado,
					attributes: ['id', 'nombre'],
					required: true,
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			cartera,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerCliente = async (req, res) => {
	try {
		const clientes = await Cliente.findAll({
			attributes: ['id', 'nombre', 'apellido'],
			include: [
				{
					model: Cartera,
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			clientes,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerEmpleado = async (req, res) => {
	try {
		const empleados = await Empleado.findAll({
			attributes: ['id', 'nombre', 'estado_empleado'],
			//include: [],
			where: {
				estado_empleado: true,
			},
		});

		return res.status(StatusCodes.OK).json({
			empleados,
		});
	} catch (error) {
		console.log(error);
	}
};

const registrarCartera = async (req, res) => {
	try {
		const { cliente_fk, empleado_fk } = req.body;

		let cartera = null;

		await db.transaction(async (t) => {
			cartera = await Cartera.create(
				{
					incobrable: 1,
					cliente_fk,
					empleado_fk,
				},
				{ transaction: t }
			);
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el empleado',
			cartera,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	obtenerCartera,
	obtenerCliente,
	obtenerEmpleado,
	registrarCartera,
};
