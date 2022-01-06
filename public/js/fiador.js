((api, alerta, tabla, confirmacion, select) => {
	const dui = document.getElementById('dui'),
		combocliente = document.getElementById('combocliente'),
		nombre = document.getElementById('nombre'),
		marca = document.getElementById('marca'),
		modelo = document.getElementById('modelo'),
		anio = document.getElementById('anio'),
		valor = document.getElementById('valor'),
		direccion = document.getElementById('direccion'),
		archivo_compra = document.getElementById('archivo_compra'),
		vehiculoForm = document.getElementById('agregar-vehiculo-form'),
		btnvehiculoForm = document.getElementById('btn-agregar-vehiculo'),
		tituloModal = document.getElementById('agregarVehiculoModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-modal');
	let idvehiculo;

	document.addEventListener('DOMContentLoaded', () => {
		obtenerFiador();
		obtenerClientes();
	});

	async function obtenerFiador() {
		try {
			const [resp, data] = await api({
				url: 'fiador',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const fiadors = resp.fiador;
				console.log(fiadors),
					fiadors.forEach((fiador) => {
						var tpl = document.createElement('template');
						tpl.innerHTML = `
											<tr>
												
												<td>${fiador.cliente.nombre + ' ' + fiador.cliente.apellido}</td>
												<td>${fiador.nombre}</td>
												<td>${fiador.dui}</td>
												<td>${fiador.direccion}</td>
												<td>${fiador.telefono}</td>
												<td>${fiador.tipo_empleo}</td>
												<td>${fiador.lugar_trabajo}</td>
												<td>${fiador.ingresos}</td>
												<td><a href='/api/fiador/obtener-archivo/${
													fiador.archivo_const_laboral
												}' target='_blank'>Ver documento</a></td>
												<td>
												<button 
													>
													</button>
														
												</td>
											</tr>`;
						fragmento.appendChild(tpl.content);
					});
				document.getElementById('tbody-fiador').innerHTML = '';
				document.getElementById('tbody-fiador').append(fragmento);
				tabla('tabla-fiador');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerClientes() {
		try {
			const [resp, data] = await api({
				url: `fiador/cliente`,
				method: 'GET',
				json: {},
			});
			if (data.status === 200) {
				const select = document.getElementById('combocliente');
				const clientes = resp.clientes;
				console.log(clientes);
				clientes.forEach((cliente) => {
					if (
						cliente['vehiculos'].length == 0 &&
						cliente['hipotecas'].length == 0 &&
						cliente['fiadors'].length == 0
					) {
						option = document.createElement('option');
						option.value = cliente.id;
						option.text = cliente.nombre + ' ' + cliente.apellido;
						select.appendChild(option);
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	document
		.getElementById('agregar-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';

			tituloModal.textContent = 'Agregar Fiador';
			archivo_compra.required = true;
			combocliente.disabled = false;
			vehiculoForm.reset();
			mascaraDUI.updateValue();
			mascaraNombre.updateValue();

			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});
})(api, alerta, tabla, confirmacion, select);
