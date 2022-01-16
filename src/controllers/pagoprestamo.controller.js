const render = (vista) => `autenticacion/${vista}`;
const { StatusCodes } = require('http-status-codes');
const { Pago } = require('../models/Pago');

const vistaPrestamo = async (req, res) => {
	res.render(render('login'));
};

const obtenerPago2 = async (req, res) => {
	try {
		const pagos = await Pago.findAll({
			attributes: [
				'id',
				'monto_cuota',
				'fecha',
				'prestamo_fk',
				'empleado_fk',
				'interes',
				'saldo_actual',
				'saldo_mora',
			],
			where: [{ prestamo_fk: req.params.id }],
		});
		console.log('p=' + pagos);
		return res.status(StatusCodes.OK).json({
			pagos,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	vistaPrestamo,
	obtenerPago2,
};
