const fileExtension = require('file-extension');
const { StatusCodes } = require('http-status-codes');
const uuid = require('uuid');
const path = require('path');
const { db } = require('../database/db');
const { hashClave } = require('../helpers/hash-clave');
const { Cliente } = require('../models/Cliente');
const { Empleado } = require('../models/Empleado');
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
	editarEmpleado,
	obtenerHipoteca,
	obtenerCliente,
};
