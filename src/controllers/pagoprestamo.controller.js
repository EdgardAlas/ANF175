const render = (vista) => `autenticacion/${vista}`;
const { StatusCodes } = require('http-status-codes');
const { Pago } = require('../models/Pago');

const vistaPrestamo = async (req, res) => {
	res.render(render('login'));
};

const obtenerPago2 = async (req, res) => {
	try {
		const pago = await Pago.findAll({});
		console.log('pago=' + pago);
		return res.status(StatusCodes.OK).json({
			pago,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	vistaPrestamo,
	obtenerPago2,
};
