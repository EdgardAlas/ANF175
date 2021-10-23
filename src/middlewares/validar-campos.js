import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const validarCampos = (req, res, next) => {
	const errorFormatter = ({ msg, param }) => {
		return `{"${param}": "${msg}"}`;
	};
	const result = validationResult(req).formatWith(errorFormatter);
	if (!result.isEmpty()) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ errores: result.array() });
	}

	next();
};
