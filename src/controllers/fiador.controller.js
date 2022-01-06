const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const uuid = require('uuid');
const fileExtension = require('file-extension');
const { db } = require('../database/db');
const path = require('path');
const fs = require('fs');
const { Vehiculo } = require('../models/Vehiculo');
const { Fiador } = require('../models/Fiador');
const { Cliente } = require('../models/Cliente');
const { Hipoteca } = require('../models/Hipoteca');

const obtenerFiadores = async (req, res) => {
	try {
		const fiador = await Fiador.findAll({
			attributes: [
				'id',
				'nombre',
				'dui',
				'direccion',
				'telefono',
				'tipo_empleo',
				'lugar_trabajo',
				'ingresos',
				'archivo_const_laboral',
			],
			include: [
				{
					model: Cliente,
					attributes: ['id', 'nombre', 'apellido'],
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			fiador,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerClientes = async (req, res) => {
	try {
		const clientes = await Cliente.findAll({
			attributes: ['id', 'nombre', 'apellido'],
			include: [
				{
					model: Vehiculo,
				},
				{ model: Hipoteca },
				{ model: Fiador },
			],
		});
		return res.status(StatusCodes.OK).json({
			clientes,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerArchivo = async (req, res) => {
	try {
		const { nombre } = req.params;
		res.sendFile(path.resolve(__dirname, '../../uploads/' + nombre));
	} catch (error) {
		console.log(error);
		res.json({ error });
	}
};

const registrarFiador = async (req, res) => {
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
		console.log(req.body);

		let fiador = null;
		let filename = null;
		console.log('aqui');
		if (req.files) {
			let archivos = req.files.archivo;
			filename = uuid.v4() + '.' + fileExtension(archivos.name);
			const uploadPath = path.resolve(
				__dirname,
				'../../uploads/' + filename
			);
			archivos.mv(uploadPath, async function (err) {
				if (err) return res.status(500).send(err);
			});
		}

		await db.transaction(async (t) => {
			fiador = await Fiador.create(
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
				{ transaction: t }
			);
		});

		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el fiador',
			fiador,
		});
	} catch (error) {
		console.log(error);
	}
};

const editarVehiculo = async (req, res) => {
	try {
		const {
			dui,
			nombre,
			marca,
			modelo,
			anio,
			clave,
			direccion,
			valor,
			cliente_fk,
		} = req.body;
		const { id } = req.params;
		const { archivo } = req.params;
		//let vehiculo = null;
		let filename = null;

		if (req.files) {
			console.log('archivo');
			await fs.unlinkSync(
				path.resolve(__dirname, '../../uploads/' + archivo)
			);
			let archivos = req.files.archivo_compra;
			filename = uuid.v4() + '.' + fileExtension(archivos.name);
			const uploadPath = path.resolve(
				__dirname,
				'../../uploads/' + filename
			);
			archivos.mv(uploadPath, async function (err) {
				if (err) return res.status(500).send(err);
			});
			await db.transaction(async (t) => {
				await Vehiculo.update(
					{
						dui,
						nombre,
						marca,
						modelo,
						anio,
						clave,
						direccion,
						valor,
						archivo_compra: filename,
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
			console.log('sin archivo');
			await db.transaction(async (t) => {
				await Vehiculo.update(
					{
						dui,
						nombre,
						marca,
						modelo,
						anio,
						clave,
						direccion,
						valor,

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
			msg: 'se ha editado con exito el vehículo',
		});
	} catch (error) {
		console.log(error);
	}
};

const DUIpropietario = async (req, res) => {
	const { id } = req.query;
	const { dui } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Vehiculo.findOne({
				where: {
					dui,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Vehiculo.findOne({
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

const verificarCliente = async (req, res) => {
	const { id } = req.query;
	const { cliente_fk } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Vehiculo.findOne({
				where: {
					cliente_fk,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Vehiculo.findOne({
				where: {
					cliente_fk,
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
	obtenerFiadores,
	obtenerClientes,
	obtenerArchivo,
	registrarFiador,
	editarVehiculo,
	DUIpropietario,
	verificarCliente,
};
