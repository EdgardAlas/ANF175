const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const uuid = require('uuid');
const fileExtension = require('file-extension');
const { db } = require('../database/db');
const path = require('path');
// const { hashClave } = require('../helpers/hash-clave');
const { Vehiculo } = require('../models/Vehiculo');
const { Cliente } = require('../models/Cliente');

const obtenerVehiculos = async (req, res) => {
	try {
		const vehiculos = await Vehiculo.findAll({
			attributes: [
				'dui',
				'id',
				'nombre',
				'marca',
				'modelo',
				'anio',
				'direccion',
				'valor',
				'archivo_compra',
			],
			include: [
				{
					model: Cliente,
					attributes: ['id', 'nombre', 'apellido'],
					// where: {
					// 	[Op.not]: {
					// 		Cliente: 'Administrador',
					// 	},
					// },
				},
			],
		});

		return res.status(StatusCodes.OK).json({
			vehiculos,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerClientes = async (req, res) => {
	try {
		// const clientes = await Cliente.findAll({
		// 	attributes: ['dui', 'id', 'nombre'],
		// 	include: [
		// 		{
		// 			model: Vehiculo,

		// 			required: false,
		// 		},
		// 	],
		// 	where: {
		// 		cliente_fk: null,
		// 	},
		// 	required: true,
		// });
		const clientes = await Vehiculo.findAll({
			attributes: ['cliente_fk'],
			include: [
				{
					model: Cliente,

					attributes: ['id', 'nombre', 'apellido'],
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

const obtenerArchivo = async (req, res) => {
	try {
		const { nombre } = req.params;
		res.sendFile(path.resolve(__dirname, '../../uploads/' + nombre));
	} catch (error) {
		console.log(error);
		res.json({ error });
	}
};

const registrarVehiculo = async (req, res) => {
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
		console.log(req.body);

		let vehiculo = null;
		let filename = null;
		if (req.files) {
			let archivos = req.files.archivo_compra;
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
			vehiculo = await Vehiculo.create(
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
				{ transaction: t }
			);
		});

		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el vehiculo',
			vehiculo,
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
		//let vehiculo = null;
		let filename = null;
		if (req.files) {
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
	obtenerVehiculos,
	obtenerClientes,
	registrarVehiculo,
	obtenerArchivo,
	editarVehiculo,
	DUIpropietario,
	verificarCliente,
};
