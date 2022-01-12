const { StatusCodes } = require('http-status-codes');
const { db } = require('../database/db');
const { Activo } = require('../models/Activo');
const { Empleado } = require('../models/Empleado');
const { TipoActivo } = require('../models/TipoActivo');

const obtenerActivo = async (req, res) => {
	try {
		const activo = await Activo.findAll({
			include: [{ model: TipoActivo }, { model: Empleado }],
		});

		return res.status(StatusCodes.OK).json({
			activo,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerEmpleado = async (req, res) => {
	try {
		const empleado = await Empleado.findAll({});

		return res.status(StatusCodes.OK).json({
			empleado,
		});
	} catch (error) {
		console.log(error);
	}
};

const obtenerTipoactivo = async (req, res) => {
	try {
		const tipoactivo = await TipoActivo.findAll({});

		return res.status(StatusCodes.OK).json({
			tipoactivo,
		});
	} catch (error) {
		console.log(error);
	}
};

const registrarActivo = async (req, res) => {
	try {
		const {
			tipo_adquisicion,
			nombre_activo,
			marca,
			modelo,
			serie,
			fecha_adquisicion,
			valor_adquisicion,

			tipo_activo_fk,
			empleado_fk,
		} = req.body;

		let activo = null;

		await db.transaction(async (t) => {
			activo = await Activo.create(
				{
					tipo_adquisicion,
					nombre_activo,
					marca,
					modelo,
					serie,
					fecha_adquisicion,
					valor_adquisicion,
					estado_adquisicion: 1,

					tipo_activo_fk,
					empleado_fk,
				},
				{ transaction: t }
			);
		});
		return res.status(StatusCodes.CREATED).json({
			msg: 'se ha registrado con exito el activo fijo',
			activo,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	obtenerActivo,
	obtenerEmpleado,
	obtenerTipoactivo,
	registrarActivo,
};
