const { StatusCodes } = require('http-status-codes');
const { db } = require('../database/db');
const { crearSesion } = require('../helpers/crear-sesion');
const { generarJWT } = require('../helpers/generar-jwt');
const { compararClave } = require('../helpers/hash-clave');
const { Usuario } = require('../models/Usuario');

const login = async (req, res) => {
	const { usuario, clave } = req.body;

	try {
		let encontrado = null;

		await db.transaction(async (t) => {
			encontrado = await Usuario.findOne({
				where: {
					usuario,
				},
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
			id: usuario.id,
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
