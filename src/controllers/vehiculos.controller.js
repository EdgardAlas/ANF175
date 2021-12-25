const { StatusCodes } = require('http-status-codes');
// const { Op } = require('sequelize');
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
					attributes: ['nombre', 'apellido'],
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
		const clientes = await Cliente.findAll({
			attributes: ['dui', 'id', 'nombre', 'apellido'],
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

module.exports = {
	obtenerVehiculos,
	obtenerClientes,
	registrarVehiculo,
	obtenerArchivo,
};
