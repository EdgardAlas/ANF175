const baseURL = '/api';

const colores = {
	primary: '#5a8dee',
	secondary: '#475f7b',
	success: '#39da8a',
	danger: '#ff5b5c',
	info: '#00cfdd',
};

const api = ({ url = '', json = {}, method = 'GET' }) =>
	new Promise(async (resolve, reject) => {
		try {
			let data = {};
			if (method === 'GET' || method == 'DELETE') {
				data = await fetch(`${baseURL}/${url}`, {
					method,
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});
			} else {
				data = await fetch(`${baseURL}/${url}`, {
					method,
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(json),
				});
			}

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
