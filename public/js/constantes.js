const baseURL = '/api';

const colores = {
	primary: '#5a8dee',
	secondary: '#475f7b',
	success: '#39da8a',
	danger: '#ff5b5c',
	info: '#00cfdd',
};

const api = (url = '', json = {}) =>
	new Promise(async (resolve, reject) => {
		try {
			const data = await fetch(`${baseURL}/${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(json),
			});
			const resp = await data.json();
			return resolve([resp, data]);
		} catch (error) {
			reject(error);
		}
	});

const alerta = (texto, alerta) => {
	Toastify({
		text: texto,
		duration: 3000,
		close: true,
		stopOnFocus: true,
		style: {
			background: colores[alerta],
		},
	}).showToast();
};
