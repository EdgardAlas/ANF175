((api, alerta, tabla, confirmacion, select) => {
	const combocliente = document.getElementById('combocliente'),
		dui = document.getElementById('dui'),
		nombre = document.getElementById('nombre'),
		direccion = document.getElementById('direccion'),
		telefono = document.getElementById('telefono'),
		tipoEmpleo = document.getElementById('tipoEmpleo'),
		lugarTrabajo = document.getElementById('lugarTrabajo'),
		ingreso = document.getElementById('ingreso'),
		archivo = document.getElementById('archivo'),
		fiadorForm = document.getElementById('agregar-form'),
		btnvehiculoForm = document.getElementById('btn-agregar-vehiculo'),
		tituloModal = document.getElementById('agregarModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-modal');
	let idvehiculo;

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});

	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});

	const mascaraTelefono = IMask(telefono, {
		mask: '#000-0000',
		definitions: {
			'#': /[6-7]/,
		},
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
												<td>${fiador.tipo_empleo ? 'Informal' : 'Formal'}</td>
												<td>${fiador.lugar_trabajo}</td>
												<td>${fiador.ingresos}</td>
												<td><a href='/api/fiador/obtener-archivo/${
													fiador.archivo_const_laboral
												}' target='_blank'>Ver documento</a></td>
												<td>
												<button 
												type="button" 
														class="btn btn-warning text-white editar-vehiculo" 
													>
													<i class="bi bi-pencil-square editar-vehiculo"
															></i>
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

	async function registrarFiador(e) {
		e.preventDefault();
		let cliente_fk = combocliente.value;

		if (cliente_fk === '-1') {
			combocliente.focus();
			return '';
		}

		if (tipoEmpleo.value === '-1') {
			tipoEmpleo.focus();
			return '';
		}

		const json = {
			nombre: nombre.value,
			dui: dui.value,
			direccion: direccion.value,
			telefono: telefono.value,
			tipo_empleo: tipoEmpleo.value,
			lugar_trabajo: lugarTrabajo.value,
			ingresos: ingreso.value,
			archivo: archivo.files[0],
			cliente_fk,
		};
		const formData = new FormData();

		Object.keys(json).forEach(function (key) {
			formData.append(key, json[key]);
		});

		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		if (btnTexto.textContent === 'Editar') {
			return editarvehiculo(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este fiador?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'fiador',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 201) {
						console.log(resp.fiador);
						combocliente.remove(combocliente.selectedIndex);
						alerta('Se ha regitrado el fiador con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-modal')
						).hide();
						obtenerFiador();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	document
		.getElementById('agregar-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';
			tituloModal.textContent = 'Agregar Fiador';
			archivo.required = true;
			combocliente.disabled = false;
			fiadorForm.reset();
			select('#combocliente', '#agregar-modal');
			mascaraDUI.updateValue();
			mascaraNombre.updateValue();
			mascaraTelefono.updateValue();

			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('agregar-modal')
		.addEventListener('shown.bs.modal', () => {
			dui.focus();
		});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerFiador();
		obtenerClientes();
	});

	fiadorForm.addEventListener('submit', registrarFiador);
})(api, alerta, tabla, confirmacion, select);
