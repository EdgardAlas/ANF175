const { StatusCodes } = require('http-status-codes');
const { Empleado } = require('../models/Empleado');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Vehiculo } = require('../models/Vehiculo');
const { Hipoteca } = require('../models/Hipoteca');
const { Prestamo } = require('../models/Prestamo');
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

				{
					model: Prestamo,
				},
			],
			where: [{ empleado_fk: req.id }],
		});

		return res.status(StatusCodes.OK).json({
			cartera,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerprestamo = async (req, res) => {
	try {
		const prestamo = await Prestamo.findAll({
			attributes: ['id', 'monto', 'duracion', 'dia_pago', 'cartera_fk'],
			include: [
				{
					model: Cartera,
				},
			],
			where: [{ cartera_fk: req.params.id }],
		});

		return res.status(StatusCodes.OK).json({
			prestamo,
		});
	} catch (error) {
		console.log(error);
	}
};

const registrarPrestamo = async (req, res) => {
	try {
		const {
			monto,
			duracion,
			dia_pago,
			fecha_aprobacion,
			valor_cuota,
			valor_total,
			cartera_fk,
			tasa_interes_fk,
		} = req.body;

		let prestamo = null;

		await db.transaction(async (t) => {
			prestamo = await Prestamo.create(
				{
					monto,
					duracion,
					dia_pago,
					fecha_aprobacion,
					valor_cuota,
					valor_total,
					cartera_fk,
					tasa_interes_fk,
				},
				{ transaction: t }
			);
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el prestamo',
			prestamo,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	obtenerCartera,
	registrarPrestamo,
	obtenerprestamo,
};
