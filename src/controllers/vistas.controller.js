const { eliminarSesion } = require('../helpers/crear-sesion');

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
};
