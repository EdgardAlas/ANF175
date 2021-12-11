const crearSesion = (res, token) => {
	res.cookie('Authorization', token, {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 3 * 60 * 60 * 1000,
		path: '/',
	});
};

module.exports = {
	crearSesion,
};
