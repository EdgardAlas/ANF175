const bcrypt = require('bcrypt');

const hashClave = async (clave = '') => {
	return new Promise((resolve, reject) => {
		try {
			const salt = bcrypt.genSaltSync();
			return resolve(bcrypt.hashSync(clave, salt));
		} catch (error) {
			return reject('No se puede crear el hash de la clave');
		}
	});
};

const compararClave = (clave, hash) => {
	try {
		const comparar = bcrypt.compareSync(clave, hash);
		return comparar;
	} catch (error) {
		return false;
	}
};

module.exports = {
	hashClave,
	compararClave,
};
