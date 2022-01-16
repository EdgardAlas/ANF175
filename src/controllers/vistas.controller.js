//const { where } = require('sequelize/types');
const { eliminarSesion } = require('../helpers/crear-sesion');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Pago } = require('../models/Pago');
const { Prestamo } = require('../models/Prestamo');

const render = (vista) => `autenticacion/${vista}`;

const vistaLogin = async (req, res) => {
	res.render(render('login'));
};

const vistaEmpleados = (req, res) => {
	res.render('empleados/empleados', {
		rol: req.rol,
		pagina: 'empleados',
	});
};

const logout = async (req, res) => {
	eliminarSesion(res);
	res.redirect('/login');
};

const inicio = (req, res) => {
	res.render('inicio', { rol: req.rol, pagina: 'inicio' });
};

const vistaClientes = (req, res) => {
	res.render('clientes/clientes', { rol: req.rol, pagina: 'clientes' });
};

const vistaVehiculos = (req, res) => {
	res.render('vehiculos/vehiculos', {
		rol: req.rol,
		pagina: 'vehiculos',
	});
};

const vistaFiador = (req, res) => {
	res.render('fiador/fiador', {
		rol: req.rol,
		pagina: 'fiador',
	});
};

const vistaPago = (req, res) => {
	res.render('pago/pago', {
		rol: req.rol,
		pagina: 'pago',
	});
};

const vistaCartera = (req, res) => {
	res.render('cartera/cartera', {
		rol: req.rol,
		pagina: 'Cartera de clientes',
	});
};

const vistaHipoteca = (req, res) => {
	res.render('hipoteca/hipoteca', {
		rol: req.rol,
		pagina: 'Hipoteca de clientes',
	});
};

const vistaActivo = (req, res) => {
	res.render('activo/activo', {
		rol: req.rol,
		pagina: 'Activo',
	});
};

const vistaInfoContable = (req, res) => {
	res.render('infocontable/infocontable', {
		rol: req.rol,
		pagina: 'Informacion contable',
	});
};

const vistaCarteraemp = (req, res) => {
	res.render('carteraempleado/carteraempledo', {
		rol: req.rol,
		pagina: 'carteraempleado',
	});
};

const vistaPagoPrestamo = (req, res) => {
	console.log('sii');
	res.render('pagoprestamo/pagoprestamo', {
		rol: req.rol,
		pagina: '',
	});
};

// const vistaPrestamo = async (req, res) => {
// 	console.log('vistaPrestamo');
// 	try {
// 		const prestamo = await Prestamo.findOne({
// 			Attributes: ['id', 'monto', 'duracion', 'dia_pago', 'cartera_fk'],
// 			include: [
// 				{
// 					model: Cartera,
// 					include: [{ model: Cliente }],
// 				},
// 				{
// 					model: Pago,
// 				},
// 			],
// 			where: {
// 				cartera_fk: req.params.id,
// 			},
// 		});
// 		console.log(prestamo.pagos[{}]);

// 		res.render('pagoprestamo/pagoprestamo', {
// 			prestamo,
// 			rol: req.rol,
// 			pagina: 'carteraempleado',
// 		});
// 	} catch (error) {
// 		console.log('error=' + error);
// 	}
// 	// res.render(render('login'));
// };

const vistaPrestamo = async (req, res) => {
	console.log('vistaPrestamo=' + req.params.id);
	try {
		let pago = await Pago.findOne({
			include: [
				{
					model: Prestamo,
					Attributes: [
						'id',
						'monto',
						'duracion',
						'dia_pago',
						'cartera_fk',
					],

					include: [
						{
							model: Cartera,

							include: [{ model: Cliente }],
						},
					],
					where: [
						{
							cartera_fk: req.params.id,
						},
					],
				},
			],
		});
		if (!pago) {
			console.log('entro al segundo');
			pago = await Prestamo.findOne({
				include: [
					{
						model: Cartera,
						include: [{ model: Cliente }],
					},
				],
				where: [
					{
						cartera_fk: req.params.id,
					},
				],
			});
		}
		console.log('pago=' + pago.prestamo.cliente);

		res.render('pagoprestamo/pagoprestamo', {
			pago,
			rol: req.rol,
			pagina: 'carteraempleado',
		});
	} catch (error) {
		console.log('error=' + error);
	}
	// res.render(render('login'));
};

module.exports = {
	vistaLogin,
	logout,
	vistaEmpleados,
	inicio,
	vistaClientes,
	vistaVehiculos,
	vistaCartera,
	vistaHipoteca,
	vistaFiador,
	vistaActivo,
	vistaPago,
	vistaInfoContable,
	vistaCarteraemp,
	vistaPrestamo,
	vistaPagoPrestamo,
};
