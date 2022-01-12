const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const uuid = require('uuid');
const fileExtension = require('file-extension');
const { db } = require('../database/db');
const path = require('path');
const fs = require('fs');
const { Fiador } = require('../models/Fiador');
const { Cliente } = require('../models/Cliente');
const { Prestamo } = require('../models/Prestamo');
const { Cartera } = require('../models/Cartera');
const { Pago } = require('../models/Pago');

const obtenerPagos = async (req, res) => {
	try {
		const pagos = await Prestamo.findAll({
			attributes: [
				'id',
				'monto',
				'duracion',
				'dia_pago',
				'fecha_aprobacion',
				'valor_cuota',
				'valor_total',
			],
			include: [
				{
					model: Cartera,
					attributes: ['id', 'incobrable', 'empleado_fk'],
					include: [
						{
							model: Cliente,
							attributes: ['id', 'nombre', 'apellido'],
							required: true,
						},
					],
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			pagos,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerPagosReal = async (req, res) => {
	try {
		const { id } = req.params;
		const pagos = await Pago.findAll({
			attributes: ['id', 'monto_cuota', 'fecha'],
			where: {
				prestamo_fk: id,
			},
		});

		return res.status(StatusCodes.OK).json({
			pagos,
		});
	} catch (error) {
		console.log(error);
	}
};

const registrarPago = async (req, res) => {
	try {
		const { monto_cuota, fecha, prestamo_fk, empleado_fk } = req.body;
		let pago = null;
		await db.transaction(async (t) => {
			pago = await Pago.create(
				{
					monto_cuota,
					fecha,
					prestamo_fk,
					empleado_fk,
				},
				{ transaction: t }
			);
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el fiador',
			pago,
		});
	} catch (error) {
		console.log(error);
	}
};

const DUIpropietario = async (req, res) => {
	const { dui, id } = req.params;
	try {
		let existe = false;
		if (id !== null) {
			existe = await Fiador.findOne({
				where: {
					dui,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Fiador.findOne({
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

const editarFiador = async (req, res) => {
	try {
		const {
			nombre,
			dui,
			direccion,
			telefono,
			tipo_empleo,
			lugar_trabajo,
			ingresos,
			cliente_fk,
		} = req.body;
		const { id, archivoF } = req.params;
		let filename = null;

		if (req.files) {
			await fs.unlinkSync(
				path.resolve(__dirname, '../../uploads/' + archivoF)
			);
			let archivos = req.files.archivo;
			filename = uuid.v4() + '.' + fileExtension(archivos.name);
			const uploadPath = path.resolve(
				__dirname,
				'../../uploads/' + filename
			);
			archivos.mv(uploadPath, async function (err) {
				if (err) return res.status(500).send(err);
			});
			await db.transaction(async (t) => {
				await Fiador.update(
					{
						nombre,
						dui,
						direccion,
						telefono,
						tipo_empleo,
						lugar_trabajo,
						ingresos,
						archivo_const_laboral: filename,
						cliente_fk,
					},
					{
						transaction: t,
						where: {
							id,
						},
					}
				);
			});
		} else {
			await db.transaction(async (t) => {
				await Fiador.update(
					{
						nombre,
						dui,
						direccion,
						telefono,
						tipo_empleo,
						lugar_trabajo,
						ingresos,
						cliente_fk,
					},
					{
						transaction: t,
						where: {
							id,
						},
					}
				);
			});
		}

		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha editado con exito el fiador',
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	obtenerPagos,
	obtenerPagosReal,
	registrarPago,
	editarFiador,
	DUIpropietario,
};
