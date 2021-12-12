const { StatusCodes } = require('http-status-codes');
const { db } = require('../database/db');
const { crearSesion } = require('../helpers/crear-sesion');
const { generarJWT } = require('../helpers/generar-jwt');
const { compararClave } = require('../helpers/hash-clave');
const { Empleado } = require('../models/Empleado');
const { Rol } = require('../models/Rol');

const login = async (req, res) => {
	const { usuario, clave } = req.body;

	try {
		let encontrado = null;

		await db.transaction(async (t) => {
			encontrado = await Empleado.findOne({
				where: {
					usuario,
				},
				include: [
					{
						model: Rol,
						attributes: ['rol'],
					},
				],
				transaction: t,
			});
		});

		if (!encontrado) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				msg: 'No se puede iniciar sesión con los datos proporcionados',
			});
		}

		const validar = compararClave(clave, encontrado.clave);

		if (!validar) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				msg: 'No se puede iniciar sesión con los datos proporcionados',
			});
		}

		const token = await generarJWT({
			id: encontrado.id,
			rol: encontrado.rol.rol,
		});

		crearSesion(res, token);

		return res.status(StatusCodes.OK).json({
			msg: 'Se ha iniciado sesión con exito',
		});
	} catch (error) {
		console.error(error);
	}

	res.status(StatusCodes.OK).json({
		tes: ' hoa',
	});
};

module.exports = {
	login,
};
