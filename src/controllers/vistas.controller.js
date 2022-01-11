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
};
