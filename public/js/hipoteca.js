((api, alerta, tabla, confirmacion, select) => {
	const dui = document.getElementById('dui'),
		combocliente = document.getElementById('combocliente'),
		nombre = document.getElementById('nombre'),
		longitud = document.getElementById('longitud'),
		latitud = document.getElementById('latitud'),
		altitud = document.getElementById('altitud'),
		tamanio = document.getElementById('tamanio'),
		combozona = document.getElementById('combozona'),
		valor = document.getElementById('valor'),
		direccion = document.getElementById('direccion'),
		archivo_escritura = document.getElementById('archivo_escritura'),
		hipotecaForm = document.getElementById('agregar-hipoteca-form'),
		btnhipotecaForm = document.getElementById('btn-agregar-hipoteca'),
		//tituloModal = document.getElementById('agregarVehiculoModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});

	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});

	const mascaraLongitud = IMask(longitud, {
		mask: '-00.000000',
	});

	const mascaraLatitud = IMask(latitud, {
		mask: '00.000000',
	});
	const mascaraAltitud = IMask(altitud, {
		mask: '00.0000000',
	});
	const mascaraTamanio = IMask(tamanio, {
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
                                            <td>${hipoteca.cliente.nombre} ${hipoteca.cliente.apellido}</td>
												<td>${hipoteca.dui}</td>
												<td>${hipoteca.nombre}</td>
												<td>${hipoteca.valor}</td>
                                                <td><a href='/api/vehiculo/obtener-archivo/${hipoteca.archivo_escritura}' target='_blank'>Ver documento</a></td>
                                                <td><button 
                                                type="button" 
                                                class="btn btn-info text-white editar-empleado"><i class="bi bi-eye-fill"></i></button>
                                                
                                                </td>
												<td>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-empleado" 
														data-id="${hipoteca.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-empleado-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-dui=${hipoteca.dui}
														data-id=${hipoteca.id}
														data-nombre=${hipoteca.nombre}
														data-telefono=${hipoteca.telefono}
														data-usuario=${hipoteca.usuario}
														data-correo=${hipoteca.correo_electronico}
													>
														<i 
															data-dui=${hipoteca.dui}
															data-id=${hipoteca.id}
															data-nombre=${hipoteca.nombre}
															data-telefono=${hipoteca.telefono}
															data-usuario=${hipoteca.usuario}
															data-correo=${hipoteca.correo_electronico}
															class="bi bi-pencil-square editar-empleado"
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
			longitud: longitud.value,
			latitud: latitud.value,
			tamanio: tamanio.value,
			zona: zona,
			direccion: direccion.value,
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
			return editarvehiculo(json);
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
})(api, alerta, tabla, confirmacion, select);
