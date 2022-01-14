const baseURL = '/api';

const colores = {
	primary: '#5a8dee',
	secondary: '#475f7b',
	success: '#39da8a',
	danger: '#ff5b5c',
	info: '#00cfdd',
	warning: '#fdac41',
};

const api = ({ url = '', json = {}, method = 'GET', archivo = false }) =>
	new Promise(async (resolve, reject) => {
		try {
			let data = {};
			if (archivo) {
				data = await fetch(`${baseURL}/${url}`, {
					method,
					credentials: 'include',
					body: json,
				});
			} else if (method === 'GET' || method == 'DELETE') {
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
	let tbl = null;
	if (datatablesSimple) {
		tbl = $(datatablesSimple).DataTable({
			language: {
				sProcessing: 'Procesando...',
				sLengthMenu: 'Mostrar _MENU_ registros',
				sZeroRecords: 'No se encontraron resultados',
				sEmptyTable: 'Ningún dato disponible en esta tabla',
				sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
				sInfoEmpty:
					'Mostrando registros del 0 al 0 de un total de 0 registros',
				sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
				sInfoPostFix: '',
				sSearch: 'Buscar:',
				sUrl: '',
				sInfoThousands: ',',
				sLoadingRecords: 'Cargando...',
				oPaginate: {
					sFirst: 'Primero',
					sLast: 'Último',
					sNext: 'Siguiente',
					sPrevious: 'Anterior',
				},
				oAria: {
					sSortAscending:
						': Activar para ordenar la columna de manera ascendente',
					sSortDescending:
						': Activar para ordenar la columna de manera descendente',
				},
			},
		});
	}

	return tbl;
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

const select = (elemento, modal) => {
	if (modal) {
		$(elemento).select2({
			theme: 'bootstrap4',
			dropdownParent: $(modal),
			language: {
				noResults: function () {
					return 'No hay resultados';
				},
				searching: function () {
					return 'Buscando..';
				},
			},
		});
	} else {
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
	}
};
