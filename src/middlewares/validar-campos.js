const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validarCampos = (req, res, next) => {
	const errorFormatter = ({ msg, param }) => {
		return `{"${param}": "${msg}"}`;
	};
	const result = validationResult(req).formatWith(errorFormatter);
	if (!result.isEmpty()) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ errores: result.array().map((res) => JSON.parse(res)) });
	}
	// result.array();

	next();
};

module.exports = {
	validarCampos,
};
