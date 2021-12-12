const { eliminarSesion } = require('../helpers/crear-sesion');

const render = (vista) => `autenticacion/${vista}`;

const vistaLogin = async (req, res) => {
	res.render(render('login'));
};

const vistaEmpleados = (req, res) => {
	res.render('empleados/empleados');
};

const logout = async (req, res) => {
	eliminarSesion(res);
	res.redirect('/login');
};

module.exports = {
	vistaLogin,
	logout,
	vistaEmpleados,
};
