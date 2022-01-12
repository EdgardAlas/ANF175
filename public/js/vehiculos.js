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
		btnTexto = document.getElementById('btn-texto'),
		btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-vehiculo-modal');
	let idvehiculo;

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});

	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});

	btnCerrar.addEventListener('click', () => {
		if (btnTexto.textContent === 'Editar') {
			combocliente.remove(combocliente.length - 1);
		}
	});

	document
		.getElementById('tbody-vehiculos')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar-vehiculo');
			if (!editar) {
				return;
			}
			tituloModal.textContent = 'Editar vehiculo';
			btnTexto.textContent = 'Editar';
			dui.value = target.dataset.dui;
			nombre.value = target.dataset.nombre;
			marca.value = target.dataset.marca;
			modelo.value = target.dataset.modelo;
			anio.value = target.dataset.anio;
			valor.value = target.dataset.valor;
			direccion.value = target.dataset.direccion;
			option = document.createElement('option');
			option.value = target.dataset.combocliente;
			option.text = target.dataset.cliente;
			combocliente.appendChild(option);

			combocliente.value = target.dataset.combocliente;
			idvehiculo = target.dataset.archivo;

			combocliente.disabled = true;
			id = target.dataset.id;
			archivo_compra.required = false;
			select('#combocliente', '#agregar-vehiculo-modal');
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerVehiculos();
		obtenerClientes();
	});

	document
		.getElementById('agregar-vehiculo-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';

			tituloModal.textContent = 'Agregar Vehiculo';
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

	document
		.getElementById('agregar-vehiculo-modal')
		.addEventListener('shown.bs.modal', () => {
			dui.focus();
		});

	dui.addEventListener('keyup', DUIpropietario);
	combocliente.addEventListener('click', verificarCliente);

	async function verificarCliente() {
		// if (dui.value.trim().length === 0) {
		// 	return;
		// }

		let url = `vehiculo/verificarcliente/${combocliente.value}`;
		if (btnTexto.textContent === 'Editar') {
			url += `?cliente_fk=${combocliente.value}`;
		}
		try {
			const [resp, data] = await api({
				url,
				method: 'GET',
			});
			if (resp.existe) {
				alerta('Este Cliente ya tiene un credito activo', 'warning');
				combocliente.value = -1;
				//combocliente.focus();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function DUIpropietario() {
		if (dui.value.trim().length === 0) {
			return;
		}

		let url = `vehiculo/dui/${dui.value}`;
		if (btnTexto.textContent === 'Editar') {
			url += `?id=${id}`;
		}
		try {
			const [resp, data] = await api({
				url,
				method: 'GET',
			});
			if (resp.existe) {
				alerta('Este DUI ya esta en uso', 'warning');
				dui.value = '';
				dui.focus();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerVehiculos() {
		try {
			//registrando();
			const [resp, data] = await api({
				url: 'vehiculo',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//vehiculoForm.reset();
				const fragmento = document.createDocumentFragment();
				const vehiculos = resp.vehiculos;
				vehiculos.forEach((vehiculo) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												
												<td>${vehiculo.cliente.nombre + ' ' + vehiculo.cliente.apellido}</td>
												<td>${vehiculo.marca}</td>
												<td>${vehiculo.modelo}</td>
												<td>${vehiculo.anio}</td>
												<td>${vehiculo.valor}</td>
												<td>${vehiculo.dui}</td>
												<td>${vehiculo.nombre}</td>
												<td>${vehiculo.direccion}</td>
												<td><a href='/api/vehiculo/obtener-archivo/${
													vehiculo.archivo_compra
												}' target='_blank'>Ver documento</a></td>
												<td>
												<button 
														type="button" 
														class="btn btn-warning text-white editar-vehiculo" 
														data-id="${vehiculo.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-vehiculo-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-combocliente=${vehiculo.cliente.id}
														data-cliente='${vehiculo.cliente.nombre + ' ' + vehiculo.cliente.apellido}'
														data-nombre=${vehiculo.nombre}
														data-dui=${vehiculo.dui}
														data-id=${vehiculo.id}
														data-marca=${vehiculo.marca}
														data-modelo=${vehiculo.modelo}
														data-anio=${vehiculo.anio}
														data-valor=${vehiculo.valor}
														data-direccion=${vehiculo.direccion} 
														data-archivo=${vehiculo.archivo_compra}
													>
														<i 
														data-combocliente=${vehiculo.cliente.id}
														data-cliente='${vehiculo.cliente.nombre + ' ' + vehiculo.cliente.apellido}'
															data-nombre='${vehiculo.nombre}'
															data-dui=${vehiculo.dui}
															data-id=${vehiculo.id}
															data-marca=${vehiculo.marca}
															data-modelo=${vehiculo.modelo}
															data-anio=${vehiculo.anio}
															data-valor=${vehiculo.valor}
															data-direccion='${vehiculo.direccion}'
															data-archivo=${vehiculo.archivo_compra}
															class="bi bi-pencil-square editar-vehiculo"
															></i>
													</button>
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-vehiculos').innerHTML = '';
				document.getElementById('tbody-vehiculos').append(fragmento);
				tabla('tabla-vehiculos');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerClientes() {
		let url = `vehiculo/cliente`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//console.log('OK');
				const select = document.getElementById('combocliente');
				const clientes = resp.clientes;
				clientes.forEach((cliente) => {
					if (
						cliente['vehiculos'].length == 0 &&
						cliente['hipotecas'] == 0
					) {
						option = document.createElement('option');
						option.value = cliente.id;
						option.text = cliente.nombre + ' ' + cliente.apellido;
						select.appendChild(option);
					}
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

	vehiculoForm.addEventListener('submit', registrarVehiculo);

	async function registrarVehiculo(e) {
		e.preventDefault();
		let cliente_fk = combocliente.value;

		const json = {
			dui: dui.value,
			nombre: nombre.value,
			marca: marca.value,
			modelo: modelo.value,
			anio: anio.value,
			valor: valor.value,
			direccion: direccion.value,
			archivo_compra: archivo_compra.files[0],
			cliente_fk,
		};

		//if (archivo_compra) {
		const formData = new FormData();

		Object.keys(json).forEach(function (key) {
			formData.append(key, json[key]);
		});

		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		//if (btnTexto.textContent === 'Editar') {
		//	return editarvehiculo(formData);
		//	}
		//} else {
		if (btnTexto.textContent === 'Editar') {
			return editarvehiculo(json);
		}
		//}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este vehículo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'vehiculo',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 201) {
						combocliente.remove(combocliente.selectedIndex);
						alerta('Se ha regitrado el vehiculo con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-vehiculo-modal')
						).hide();
						obtenerVehiculos();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	function editarvehiculo(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este registro?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					if (json.archivo_compra == undefined) {
						console.log('primero if');
						const [resp, data] = await api({
							url: `vehiculo/${id}`,
							method: 'PATCH',
							json,
						});
						if (data.status === 201) {
							combocliente.remove(combocliente.length - 1);
							alerta('Se ha editado el vehículo con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-vehiculo-modal')
							).hide();
							obtenerVehiculos();
						}
					} else {
						console.log(idvehiculo);
						const formData = new FormData();

						Object.keys(json).forEach(function (key) {
							formData.append(key, json[key]);
						});
						const [resp, data] = await api({
							url: `vehiculo/${id}/${idvehiculo}`,
							method: 'PATCH',
							json: formData,
							archivo: true,
						});
						if (data.status === 201) {
							alerta('Se ha editado el empleado con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-vehiculo-modal')
							).hide();
							obtenerVehiculos();
						}
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}
})(api, alerta, tabla, confirmacion, select);
