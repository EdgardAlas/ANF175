const { StatusCodes } = require('http-status-codes');

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
module.exports = {
	obtenerActivo,
};
