const { StatusCodes } = require('http-status-codes');
const { Empleado } = require('../models/Empleado');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Vehiculo } = require('../models/Vehiculo');
const { Hipoteca } = require('../models/Hipoteca');
//const { db } = require('../database/db');

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
					where: [{ id: '7026a2d6-598c-436f-b910-cee26d0e7bb2' }],
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

module.exports = {
	obtenerCartera,
};
