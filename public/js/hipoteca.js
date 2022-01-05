((api, alerta, tabla, confirmacion, select) => {
	const dui = document.getElementById('dui'),
		combocliente = document.getElementById('combocliente'),
		nombre = document.getElementById('nombre'),
		longitud = document.getElementById('longitu'),
		longitud2 = document.getElementById('longitud'),
		latitud = document.getElementById('latitu'),
		latitud2 = document.getElementById('latitud'),
		altitud = document.getElementById('altitu'),
		altitud2 = document.getElementById('altitud'),
		tamanio = document.getElementById('tamani'),
		tamanio2 = document.getElementById('tamanio'),
		combozona = document.getElementById('combozona'),
		zona = document.getElementById('zon'),
		zona2 = document.getElementById('zona'),
		valor = document.getElementById('valor'),
		direccion = document.getElementById('direccio'),
		direccion2 = document.getElementById('direccion'),
		archivo_escritura = document.getElementById('archivo_escritura'),
		hipotecaForm = document.getElementById('agregar-hipoteca-form'),
		btnhipotecaForm = document.getElementById('btn-agregar-hipoteca'),
		tituloModal = document.getElementById('agregarHipotecaModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	let idhipoteca;
	select('#combocliente', '#agregar-hipoteca-modal');

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});

	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});

	const mascaraLongitud = IMask(longitud2, {
		mask: '-00.000000',
	});

	const mascaraLatitud = IMask(latitud2, {
		mask: '00.000000',
	});
	const mascaraAltitud = IMask(altitud2, {
		mask: '00.0000000',
	});
	const mascaraTamanio = IMask(tamanio2, {
		mask: '0000',
	});
	document.addEventListener('DOMContentLoaded', () => {
		obtenerHipoteca();
		obtenerClientes();
	});

	hipotecaForm.addEventListener('submit', registrarHipoteca);

	document
		.getElementById('agregar-hipoteca-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';
			//clave.type = 'password';
			tituloModal.textContent = 'Agregar empleado';
			//clave.required = true;
			//empleadoForm.reset();
			//mascaraDUI.updateValue();
			//mascaraNombre.updateValue();
			//mascaraTelefono.updateValue();
			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('tabla-hipoteca')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('mostrar-hipoteca');
			console.log('mostrando');

			if (!editar) {
				return;
			}
			console.log(target);
			//tituloModal.textContent = 'mostrarHipoteca';
			btnTexto.textContent = 'Editar';
			longitud.value = target.dataset.longitud;
			latitud.value = target.dataset.latitud;
			altitud.value = target.dataset.altitud;
			tamanio.value = target.dataset.tamanio;
			if (target.dataset.zona) {
				zona.value = 'rural';
			} else {
				zona.value = 'urbano';
			}
			direccion.value = target.dataset.direccion;

			id = target.dataset.id;

			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	document
		.getElementById('tabla-hipoteca')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar-hipoteca');
			console.log('mostrando');

			if (!editar) {
				return;
			}
			console.log(target);
			//tituloModal.textContent = 'mostrarHipoteca';
			btnTexto.textContent = 'Editar';
			nombre.value = target.dataset.nombre;
			dui.value = target.dataset.dui;
			longitud2.value = target.dataset.longitud;
			latitud2.value = target.dataset.latitud;
			altitud2.value = target.dataset.altitud;
			tamanio2.value = target.dataset.tamanio;
			if (target.dataset.zona) {
				combozona.value = 1;
			} else {
				combozona.value = 2;
			}
			direccion2.value = target.dataset.direccion;
			option = document.createElement('option');
			option.value = target.dataset.cliente;
			option.text = target.dataset.clientenombre;
			combocliente.appendChild(option);
			combocliente.disabled = true;
			combocliente.value = target.dataset.cliente;
			valor.value = target.dataset.valor;
			idhipoteca = target.dataset.archivo;
			console.log(target.dataset.valor);
			id = target.dataset.id;
			archivo_escritura.required = false;
			select('#combocliente', '#agregar-hipoteca-modal');
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	async function obtenerClientes() {
		let url = `hipoteca/cliente`;
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
				const clientes = resp.cliente;
				clientes.forEach((cliente) => {
					if (
						cliente['hipotecas'].length == 0 &&
						cliente['vehiculos'].length == 0
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
	async function obtenerHipoteca() {
		try {
			const [resp, data] = await api({
				url: 'hipoteca',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const empleados = resp.hipoteca;
				console.log({ empleados });
				empleados.forEach((hipoteca) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
                                            <td>${hipoteca.cliente.nombre} ${
						hipoteca.cliente.apellido
					}</td>
											<td>${hipoteca.nombre}</td>	
											<td>${hipoteca.dui}</td>
												<td>${hipoteca.valor}</td>
                                                <td><a href='/api/hipoteca/obtener-archivo/${
																	hipoteca.archivo_escritura
																}' target='_blank'>Ver documento</a></td>
                                                <td><button 
                                                type="button" 
                                                class="btn btn-info text-white mostrar-hipoteca" data-bs-toggle="modal"
												data-bs-target="#mostrar-hipoteca-modal"
												data-longitud=${hipoteca.longitud}
												data-latitud=${hipoteca.latitud}
												data-altitud=${hipoteca.altitud}
												data-tamanio=${hipoteca.tamanio}
												data-zona=${hipoteca.zona}
												data-direccion="${hipoteca.direccion}"
												data-backdrop="static"
												data-keyboard="false"><i data-longitud=${hipoteca.longitud}
												data-latitud=${hipoteca.latitud}
												data-altitud=${hipoteca.altitud}
												data-tamanio=${hipoteca.tamanio}
												data-zona=${hipoteca.zona}
												data-direccion="${
													hipoteca.direccion
												}" class="mostrar-hipoteca bi bi-eye-fill"></i></button>
                                                
                                                </td>
												<td>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-hipoteca" 
														data-id="${hipoteca.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-hipoteca-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-id=${hipoteca.id}
														data-nombre='${hipoteca.nombre}'
														data-dui=${hipoteca.dui}
														data-longitud=${hipoteca.longitud}
												data-latitud=${hipoteca.latitud}
												data-altitud=${hipoteca.altitud}
												data-tamanio=${hipoteca.tamanio}
												data-zona=${hipoteca.zona}
												data-direccion="${hipoteca.direccion}"
												data-valor=${hipoteca.valor}
												data-cliente=${hipoteca.cliente.id}
												data-clientenombre="${
													hipoteca.cliente.nombre +
													' ' +
													hipoteca.cliente.apellido
												}"
												data-archivo=${hipoteca.archivo_escritura}
													>
														<i 
														data-id=${hipoteca.id}
														data-nombre='${hipoteca.nombre}'
														data-dui=${hipoteca.dui}
														data-longitud=${hipoteca.longitud}
												data-latitud=${hipoteca.latitud}
												data-altitud=${hipoteca.altitud}
												data-tamanio=${hipoteca.tamanio}
												data-zona=${hipoteca.zona}
												data-direccion="${hipoteca.direccion}"
												data-valor=${hipoteca.valor}
												data-cliente=${hipoteca.cliente.id}
												data-clientenombre="${
													hipoteca.cliente.nombre +
													' ' +
													hipoteca.cliente.apellido
												}"
												data-archivo=${hipoteca.archivo_escritura}
															class="bi bi-pencil-square editar-hipoteca"
															></i>
													</button>
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-hipoteca').innerHTML = '';
				document.getElementById('tbody-hipoteca').append(fragmento);
				tabla('tabla-hipoteca');
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function registrarHipoteca(e) {
		e.preventDefault();
		let cliente_fk = combocliente.value;
		let zona = combozona.value;
		const json = {
			dui: dui.value,
			nombre: nombre.value,
			longitud: longitud2.value,
			latitud: latitud2.value,
			altitud: altitud2.value,
			tamanio: tamanio2.value,
			zona: zona,
			direccion: direccion2.value,
			valor: valor.value,
			archivo_escritura: archivo_escritura.files[0],
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
			return editarHipoteca(json);
		}
		//}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar esta Hipoteca?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'hipoteca',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 201) {
						alerta('Se ha regitrado la hipoteca con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-hipoteca-modal')
						).hide();
						obtenerHipoteca();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	function editarHipoteca(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este registro?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					if (json.archivo_escritura == undefined) {
						console.log('primero if');
						const [resp, data] = await api({
							url: `hipoteca/${id}`,
							method: 'PATCH',
							json,
						});
						if (data.status === 201) {
							combocliente.remove(combocliente.length - 1);
							alerta('Se ha editado la hipoteca con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-hipoteca-modal')
							).hide();
							obtenerHipoteca();
						}
					} else {
						const formData = new FormData();

						Object.keys(json).forEach(function (key) {
							formData.append(key, json[key]);
						});
						const [resp, data] = await api({
							url: `hipoteca/${id}/${idhipoteca}`,
							method: 'PATCH',
							json: formData,
							archivo: true,
						});
						if (data.status === 201) {
							alerta('Se ha editado la hipoteca con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-hipoteca-modal')
							).hide();
							obtenerHipoteca();
						}
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}
})(api, alerta, tabla, confirmacion, select);
