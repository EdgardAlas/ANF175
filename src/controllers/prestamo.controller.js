// const { eliminarSesion } = require('../helpers/crear-sesion');

const render = (vista) => `autenticacion/${vista}`;

const vistaPrestamo = async (req, res) => {
	res.render(render('login'));
};

module.exports = {
	vistaPrestamo,
};
