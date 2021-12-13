const baseURL = '/api';

const colores = {
	primary: '#5a8dee',
	secondary: '#475f7b',
	success: '#39da8a',
	danger: '#ff5b5c',
	info: '#00cfdd',
	warning: '#fdac41',
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

const tabla = (tabla) => {
	const datatablesSimple = document.getElementById(tabla);
	if (datatablesSimple) {
		new simpleDatatables.DataTable(datatablesSimple, {
			perPage: 5,
			labels: {
				placeholder: 'Buscar...', // The search input placeholder
				perPage: '{select} por página', // per-page dropdown label
				noRows: 'No hay datos para mostrar', // Message shown when there are no records to show
				noResults: 'No hay datos para mostrar en la busqueda', // Message shown when there are no search results
				info: 'Mostrando {start} de {end} de {rows} registros', //
			},
		});
	}
};

const confirmacion = ({
	titulo = '',
	texto = '',
	icon = '',
	cb = () => {},
}) => {
	Swal.fire({
		title: titulo,
		text: texto,
		icon,
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si',
		cancelButtonText: 'No',
	}).then((result) => {
		if (result.isConfirmed) {
			cb();
		}
	});
};

const select = (elemento) => {
	$(elemento).select2({
		theme: 'bootstrap4',
		language: {
			noResults: function () {
				return 'No hay resultados';
			},
			searching: function () {
				return 'Buscando..';
			},
		},
	});
};
