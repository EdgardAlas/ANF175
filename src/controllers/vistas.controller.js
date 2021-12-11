const render = (vista) => `autenticacion/${vista}`;

const vistaLogin = async (req, res) => {
	res.render(render('login'));
};

module.exports = {
	vistaLogin,
};
