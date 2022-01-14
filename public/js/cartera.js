((api, alerta, tabla, confirmacion, select) => {
	const comboempleado = document.getElementById('comboempleado'),
		combocliente = document.getElementById('combocliente'),
		carteraForm = document.getElementById('agregar-cartera-form'),
		btnCarteraForm = document.getElementById('btn-agregar-cartera'),
		tituloModal = document.getElementById('agregarCarteraModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-cartera-modal');
	select('#comboempleado', '#agregar-cartera-modal');

	//select('#combocliente');

	document.addEventListener('DOMContentLoaded', () => {
		obtenerCartera();
		obtenerClientes();
		obtenerEmpleado();
	});

	carteraForm.addEventListener('submit', registrarCartera);

	btnCerrar.addEventListener('click', () => {
		if (btnTexto.textContent === 'Editar') {
			combocliente.remove(combocliente.length - 1);
		}
	});

	document
		.getElementById('agregar-cartera-modal')
		.addEventListener('hidden.bs.modal', () => {
			carteraForm.reset();
			btnTexto.textContent = 'Agregar';

			tituloModal.textContent = 'Agregar ';

			combocliente.disabled = false;

			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('tbody-cartera')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar-cartera');
			if (!editar) {
				return;
			}
			tituloModal.textContent = 'Editar';
			btnTexto.textContent = 'Editar';

			//combocliente.value = target.dataset.combocliente;

			option = document.createElement('option');
			option.value = target.dataset.combocliente;
			option.text = target.dataset.cliente;
			combocliente.appendChild(option);

			combocliente.value = target.dataset.combocliente;

			comboempleado.value = target.dataset.comboempleado;
			combocliente.disabled = true;
			id = target.dataset.id;
			select('#combocliente', '#agregar-cartera-modal');
			select('#comboempleado', '#agregar-cartera-modal');
			carteraForm.reset();
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	async function obtenerCartera() {
		try {
			//registrando();
			const [resp, data] = await api({
				url: 'cartera',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//rowForm.reset();
				const fragmento = document.createDocumentFragment();
				const cartera = resp.cartera;
				let estado;

				cartera.forEach((row) => {
					const tipoCredito =
						row.cliente['vehiculos'].length == 0
							? 'Hipotecario'
							: 'Garantía Prendaria Vehículo';
					if (row.incobrable) {
						estado = 'Activo';
					}
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${row.cliente.nombre + ' ' + row.cliente.apellido}</td>
												<td>${tipoCredito}</td>
												<td>${row.empleado.nombre}</td>
												<td class="d-flex justify-content-center"><a class='btn btn-success' >${estado}</a></td>
												
												<td>
												
												<button 
														type="button" 
														class="btn btn-warning text-white editar-cartera" 
														data-id=${row.id}
														data-bs-toggle="modal"
														data-bs-target="#agregar-cartera-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-combocliente=${row.cliente.id}
														data-comboempleado=${row.empleado.id}
														data-cliente='${row.cliente.nombre + ' ' + row.cliente.apellido}'
														
														

													>
														<i 
														data-id=${row.id}
														data-combocliente=${row.cliente.id}
														data-comboempleado=${row.empleado.id}
														data-cliente='${row.cliente.nombre + ' ' + row.cliente.apellido}'
															class="bi bi-pencil-square editar-cartera"
															></i>
													</button>
													<a 
														class="btn btn-info text-white editar-cartera" 
														href="/prestamo/${row.cliente.id}"
													>
														<i 
															class="bi bi-pencil-square"
															></i>
													</a>
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-cartera').innerHTML = '';
				document.getElementById('tbody-cartera').append(fragmento);
				tabla('tabla-cartera');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerClientes() {
		let url = `cartera/cliente`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//console.log('OK');
				//const select = document.getElementById('combocliente');
				const clientes = resp.clientes;

				clientes.forEach((client) => {
					if (
						client['carteras'].length == 0 &&
						(client['hipotecas'].length != 0 ||
							client['vehiculos'].length != 0)
					) {
						option = document.createElement('option');
						option.value = client.id;
						option.text = client.nombre + ' ' + client.apellido;
						combocliente.appendChild(option);
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerEmpleado() {
		let url = `cartera/empleado`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//console.log('OK');
				const select = document.getElementById('comboempleado');
				const empleados = resp.empleados;

				empleados.forEach((client) => {
					option = document.createElement('option');
					option.value = client.id;
					option.text = client.nombre;
					select.appendChild(option);
				});
				//document.getElementById('cliente').innerHTML = '';
				//document.getElementById('cliente').append(fragmento);
				//tabla('tabla-vehiculos');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function registrarCartera(e) {
		e.preventDefault();
		let cliente_fk = combocliente.value;
		let empleado_fk = comboempleado.value;
		console.log(empleado_fk);

		const json = {
			cliente_fk,
			empleado_fk,
		};

		if (btnTexto.textContent === 'Editar') {
			return editarCartera(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar esta cartera?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'cartera',
						method: 'POST',
						json,
					});
					if (data.status === 201) {
						combocliente.remove(combocliente.selectedIndex);
						alerta('Se ha regitrado la cartera con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-cartera-modal')
						).hide();
						obtenerCartera();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	function editarCartera(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este registro?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: `cartera/${id}`,
						method: 'PATCH',
						json,
					});
					if (data.status === 201) {
						combocliente.remove(combocliente.length - 1);
						alerta('Se ha editado el empleado con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-cartera-modal')
						).hide();
						obtenerCartera();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}
})(api, alerta, tabla, confirmacion, select);
