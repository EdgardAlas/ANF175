const fileExtension = require('file-extension');
const { StatusCodes } = require('http-status-codes');
const uuid = require('uuid');
const path = require('path');
const { db } = require('../database/db');
const fs = require('fs');
//const { hashClave } = require('../helpers/hash-clave');
const { Cliente } = require('../models/Cliente');
//const { Empleado } = require('../models/Empleado');
const { Hipoteca } = require('../models/Hipoteca');
const { Vehiculo } = require('../models/Vehiculo');
//const { Rol } = require('../models/Rol');

const registrarHipoteca = async (req, res) => {
	try {
		const {
			nombre,
			dui,
			longitud,
			latitud,
			altitud,
			tamanio,
			zona,
			direccion,
			valor,
			cliente_fk,
		} = req.body;

		let hipoteca = null;

		let filename = null;
		//console.log(req.files.archivo_compra);
		if (req.files) {
			let archivos = req.files.archivo_escritura;
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
			hipoteca = await Hipoteca.create(
				{
					dui,
					nombre,
					longitud,
					latitud,
					altitud,
					tamanio,
					zona,
					direccion,
					valor,
					cliente_fk,
					archivo_escritura: filename,
				},
				{ transaction: t }
			);
		});

		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el vehiculo',
			hipoteca,
		});
	} catch (error) {
		console.log(error);
	}
};

const editarHipoteca = async (req, res) => {
	try {
		const {
			nombre,
			dui,
			longitud,
			latitud,
			altitud,
			tamanio,
			zona,
			direccion,
			valor,
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
			let archivos = req.files.archivo_escritura;
			filename = uuid.v4() + '.' + fileExtension(archivos.name);
			const uploadPath = path.resolve(
				__dirname,
				'../../uploads/' + filename
			);
			archivos.mv(uploadPath, async function (err) {
				if (err) return res.status(500).send(err);
			});
			await db.transaction(async (t) => {
				await Hipoteca.update(
					{
						nombre,
						dui,
						longitud,
						latitud,
						altitud,
						tamanio,
						zona,
						direccion,
						archivo_escritura: filename,
						valor,
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
				await Hipoteca.update(
					{
						nombre,
						dui,
						longitud,
						latitud,
						altitud,
						tamanio,
						zona,
						direccion,
						valor,
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

const obtenerCliente = async (req, res) => {
	try {
		const cliente = await Cliente.findAll({
			attributes: ['id', 'nombre', 'apellido'],
			include: [{ model: Vehiculo }, { model: Hipoteca }],
		});

		return res.status(StatusCodes.OK).json({
			cliente,
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

const obtenerHipoteca = async (req, res) => {
	try {
		const hipoteca = await Hipoteca.findAll({
			include: [
				{ model: Cliente, attributes: ['id', 'nombre', 'apellido'] },
			],
		});

		return res.status(StatusCodes.OK).json({
			hipoteca,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	registrarHipoteca,
	editarHipoteca,
	obtenerHipoteca,
	obtenerCliente,
	obtenerArchivo,
};
