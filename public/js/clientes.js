((api, alerta, tabla, confirmacion, select2) => {
	const departamento = document.getElementById('departamento');
	const clientesModal = document.getElementById('agregar-cliente-modal');
	const clientesForm = document.getElementById('agregar-cliente-form');
	const dui = document.getElementById('dui');
	const nit = document.getElementById('nit');
	const nombre = document.getElementById('nombre');
	const apellido = document.getElementById('apellido');
	const estadoCivil = document.getElementById('estado_civil');
	const tipoCliente = document.getElementById('tipo_cliente');
	const correo = document.getElementById('correo');
	const fechaNacimiento = document.getElementById('fecha_nacimiento');
	const direccion = document.getElementById('direccion');
	const telefonos = document.getElementById('telefonos');
	const municipio = document.getElementById('municipio_fk');
	const tipoEmpleo = document.getElementById('tipo_empleo');
	const ingresos = document.getElementById('ingresos');
	const archivoConstanciaLaboral = document.getElementById(
		'archivo_constancia_laboral'
	);
	const btnTexto = document.getElementById('btn-texto');
	const agregar = document.getElementById('btn-agregar-cliente');
	let tagify;
	let tbl = null;
	let editarID = null;

	document.addEventListener('DOMContentLoaded', () => {
		// obtenerclientes();
		tbl = tabla('tabla-clientes');
		tagify = new Tagify(telefonos);

		IMask(document.querySelector(`#ingresos`), {
			mask: '$num',
			blocks: {
				num: {
					mask: Number,
					thousandsSeparator: ',',
					radix: '.',
				},
			},
		});
		iniciarDepartamentos();
		iniciarMunicipios();
	});

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});
	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});
	const mascaraApellido = IMask(apellido, {
		mask: /^[a-zA-Z\s]*$/,
	});
	const mascaraNIT = IMask(nit, {
		mask: '0000-000000-000-0',
	});

	telefonos.addEventListener('change', function onChange(e) {
		// outputs a String
	});

	$(departamento).on('select2:select', async function (e) {
		const [resp, data] = await api({
			url: `cliente/municipio/${this.value}`,
			method: 'GET',
			json: {},
		});

		if (data.status === 200) {
			const fragmento = document.createDocumentFragment();
			resp.forEach((municipio) => {
				var tpl = document.createElement('template');
				tpl.innerHTML = `
									<option value="${municipio.id}">
										${municipio.municipio}							
									</option>`;
				fragmento.appendChild(tpl.content);
			});
			municipio.innerHTML = '';
			municipio.appendChild(fragmento);
			municipio.value = document.getElementById('muni').value;
			iniciarMunicipios();
		}
	});

	clientesModal.addEventListener('hidden.bs.modal', function (e) {
		clientesForm.reset();
		$(departamento).trigger({
			type: 'select2:select',
		});
		iniciarDepartamentos();
		mascaraNIT.updateValue();
		mascaraDUI.updateValue();
		mascaraNombre.updateValue();
		mascaraApellido.updateValue();
		archivoConstanciaLaboral.value = null;
		btnTexto.textContent = 'Agregar';
		document.getElementById('archivo-editar').style.display = 'none';
		document.getElementById('agregarClienteTitulo').textContent =
			'Agregar cliente';
		const btn = document.getElementById('btn-agregar-cliente');
		btn.disabled = false;
	});

	clientesForm.addEventListener('submit', function (e) {
		e.preventDefault();
	});

	document
		.getElementById('tbody-clientes')
		.addEventListener('click', function (e) {
			if (e.target.classList.contains('mostrar-informacion')) {
				const id = e.target.dataset.id;
				mostrarInformacion(id);
				return;
			}

			if (e.target.classList.contains('editar-empleado')) {
				const id = e.target.dataset.id;
				modalEditarEmpleado(id);
				return;
			}
		});

	agregar.addEventListener('click', function (e) {
		const telefonos = tagify.value.map((tel) => ({
			telefono: tel.value,
		}));

		let json = {
			dui: dui.value,
			nit: nit.value,
			nombre: nombre.value,
			apellido: apellido.value,
			estado_civil: estadoCivil.value == '1',
			tipo_cliente: tipoCliente.value == '1',
			correo: correo.value,
			fecha_nacimiento: fechaNacimiento.value,
			direccion: direccion.value,
			telefonos,
			municipio_fk: municipio.value,
			tipo_empleo: tipoEmpleo.value == '1',
			ingresos: ingresos.value.replaceAll('$', '').replaceAll(',', ''),
			archivo_constancia_laboral: archivoConstanciaLaboral.files[0],
		};

		if (btnTexto.textContent === 'Editar') {
			return editarCliente(json);
		}

		return agregarCliente(json);
	});

	tipoCliente.addEventListener('change', (e) =>
		desabilitarCampos(e.target.value)
	);

	correo.addEventListener('keyup', existCorreo);
	dui.addEventListener('keyup', existeDUI);
	nit.addEventListener('keyup', existeNIT);

	function desabilitarCampos(e) {
		const tipo = e;
		const desabilitado = tipo == '1';
		estadoCivil.disabled = desabilitado;
		tipoEmpleo.disabled = desabilitado;
		ingresos.readOnly = desabilitado;
		archivoConstanciaLaboral.readOnly = desabilitado;
		fechaNacimiento.readOnly = desabilitado;
	}

	async function mostrarInformacion(id) {
		try {
			const [resp, data] = await api({
				url: `cliente/${id}`,
				method: 'GET',
			});
			if (data.status === 200) {
				document.getElementById(
					'nombre-cliente'
				).textContent = `${resp.nombre} ${resp.apellido}`;

				document.getElementById('codigo-cliente').textContent =
					resp.codigo_cliente;

				document.getElementById('dui-cliente').textContent = resp.dui;

				document.getElementById('nit-cliente').textContent = resp.nit;

				if (resp.tipo_cliente) {
					document.getElementById('estado-civil-div').style.display =
						'none';
				} else {
					document.getElementById('estado-civil-div').style.display =
						'block';
				}
				document.getElementById('estado-civil-cliente').textContent =
					resp.estado_civil ? 'Soltero(a)' : 'Casado(a)';

				document.getElementById('correo-cliente').textContent =
					resp.correo_electronico;

				if (resp.tipo_cliente) {
					document.getElementById('fecha-nacimiento-div').style.display =
						'none';
				} else {
					document.getElementById('fecha-nacimiento-div').style.display =
						'block';
				}
				document.getElementById('fecha-nacimiento-cliente').textContent =
					dayjs(resp.fecha_nacimiento).format('DD-MM-YYYY');

				document.getElementById(
					'direccion-cliente'
				).textContent = `${resp.direccion}, ${resp.municipio.municipio}, ${resp.municipio.departamento.departamento}`;

				if (resp.tipo_cliente) {
					document.getElementById('tipo-empleo-div').style.display =
						'none';
				} else {
					document.getElementById('tipo-empleo-div').style.display =
						'block';
				}
				document.getElementById('tipo-empleo-cliente').textContent =
					resp.tipo_empleo ? 'Informal' : 'Formal';

				if (resp.tipo_cliente) {
					document.getElementById('ingresos-div').style.display = 'none';
				} else {
					document.getElementById('ingresos-div').style.display = 'block';
				}
				document.getElementById('ingresos-cliente').textContent =
					'$' + resp.ingresos.toLocaleString();

				if (resp.tipo_cliente) {
					document.getElementById('constancia-div').style.display = 'none';
				} else {
					document.getElementById('constancia-div').style.display =
						'block';
				}
				document.getElementById(
					'constancia-cliente'
				).href = `/api/cliente/ver-constancia-laboral/${resp.archivo_constancia_laboral}`;

				const fragmento = document.createDocumentFragment();

				resp.telefonos.forEach(({ telefono }) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<li>${telefono}</li>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('telefonos-ul').innerHTML = '';
				document.getElementById('telefonos-ul').appendChild(fragmento);
			}
		} catch (error) {}
	}
	async function modalEditarEmpleado(id) {
		try {
			const [resp, data] = await api({
				url: `cliente/${id}`,
				method: 'GET',
			});
			if (data.status === 200) {
				btnTexto.textContent = 'Editar';
				editarID = resp.id;
				document.getElementById('archivo-editar').style.display = 'block';
				document.getElementById('agregarClienteTitulo').textContent =
					'Editar cliente';
				document.getElementById('muni').value = resp.municipio_fk;

				dui.value = resp.dui;
				nit.value = resp.nit;
				nombre.value = resp.nombre;
				apellido.value = resp.apellido;
				estadoCivil.value = resp.estado_civil ? '1' : '0';
				tipoCliente.value = resp.tipo_cliente ? '1' : '0';
				correo.value = resp.correo_electronico;
				fechaNacimiento.value = new Date(resp.fecha_nacimiento)
					.toISOString()
					.split('T')[0];
				direccion.value = resp.direccion;
				tagify.addTags(
					resp.telefonos.reduce((prev, curr) => {
						return [
							...prev,
							{
								value: curr.telefono,
							},
						];
					}, [])
				);
				departamento.value = resp.municipio.departamento_fk;

				$(departamento).trigger({
					type: 'select2:select',
				});

				desabilitarCampos(resp.tipo_cliente ? '1' : '0');

				iniciarDepartamentos();

				// iniciarMunicipios();
				tipoEmpleo.value = resp.tipo_empleo ? '1' : '0';
				ingresos.value = resp.ingresos;
				IMask(document.querySelector(`#ingresos`), {
					mask: '$num',
					blocks: {
						num: {
							mask: Number,
							thousandsSeparator: ',',
							radix: '.',
						},
					},
				});
			}
		} catch (error) {}
	}

	async function existCorreo({ target }) {
		if (correo.value.trim().length === 0) {
			return;
		}

		let url = `cliente/correo/${correo.value}`;
		if (btnTexto.textContent === 'Editar') {
			url += `?id=${id}`;
		}
		try {
			const [resp, data] = await api({
				url,
				method: 'GET',
			});
			if (resp.existe) {
				alerta('Este correo ya esta en uso', 'warning');
				correo.value = '';
				correo.focus();
			}
		} catch (error) {}
	}

	async function existeDUI() {
		if (dui.value.trim().length === 0) {
			return;
		}

		let url = `cliente/dui/${dui.value}`;
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
		} catch (error) {}
	}
	async function existeNIT() {
		if (nit.value.trim().length === 0) {
			return;
		}

		let url = `cliente/nit/${nit.value}`;
		if (btnTexto.textContent === 'Editar') {
			url += `?id=${id}`;
		}
		try {
			const [resp, data] = await api({
				url,
				method: 'GET',
			});
			if (resp.existe) {
				alerta('Este NIT ya esta en uso', 'warning');
				nit.value = '';
				nit.focus();
			}
		} catch (error) {}
	}

	function registrando() {
		const btn = document.getElementById('btn-agregar-cliente');
		btn.disabled = !btn.disabled;
	}

	function iniciarDepartamentos() {
		select2(departamento, '#agregar-cliente-modal');
	}

	function iniciarMunicipios() {
		select2(municipio, '#agregar-cliente-modal');
	}

	async function obtenerClientes() {
		try {
			registrando();
			const [resp, data] = await api({
				url: 'cliente',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				clientesForm.reset();
				const fragmento = document.createDocumentFragment();
				const clientes = resp;

				clientes.forEach((cliente) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${cliente.codigo_cliente}</td>
												<td>${cliente.dui}</td>
												<td>${cliente.nit}</td>
												<td>${cliente.nombre} ${cliente.apellido}</td>
												<td>${cliente.direccion}</td>
												<td>${cliente.tipo_cliente ? 'Persona Juridica' : 'Persona Natural'}</td>
												<td>
													<button
														class="btn btn-info text-white mostrar-informacion"
														data-id=${cliente.id}
														data-bs-toggle="modal"
														data-bs-target="#mostrar-cliente-modal"
														data-backdrop="static"
														data-keyboard="false"
													>
														<i
															class="bi bi-eye mostrar-informacion"
															data-id=${cliente.id}
														></i>
													</button>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-empleado" 
														data-bs-toggle="modal"
														data-bs-target="#agregar-cliente-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-id=${cliente.id}
														
													>
														<i 
															data-id=${cliente.id}
															class="bi bi-pencil-square editar-empleado"
															></i>
													</button>
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				if (tbl) {
					tbl.destroy();
				}
				document.getElementById('tbody-clientes').innerHTML = '';
				document.getElementById('tbody-clientes').append(fragmento);

				tbl = tabla('tabla-clientes');

				registrando();
			}
		} catch (error) {}
	}
	function agregarCliente(json) {
		if (json.dui.length === 0 || json.dui.length < 10) {
			alerta('El DUI no puede quedar vacio o esta incompleto', 'warning');
			setTimeout(() => dui.focus(), 0);
			return;
		}

		if (json.nit.length === 0 || json.nit.length < 17) {
			alerta('El NIT no puede quedar vacio o esta incompleto', 'warning');
			setTimeout(() => nit.focus(), 0);
			return;
		}

		if (json.nombre.length === 0) {
			alerta('El nombre no puede quedar vacio', 'warning');
			setTimeout(() => nombre.focus(), 0);
			return;
		}

		if (json.apellido.length === 0) {
			alerta('El apellido no puede quedar vacio', 'warning');
			setTimeout(() => apellido.focus(), 0);
			return;
		}

		if (json.correo.length === 0 || !validator.isEmail(json.correo)) {
			alerta(
				'El correo no puede quedar vacio o no tiene el formato correcto',
				'warning'
			);
			setTimeout(() => correo.focus(), 0);
			return;
		}

		if (json.direccion.length === 0) {
			alerta('La dirección no puede quedar vacia', 'warning');
			setTimeout(() => direccion.focus(), 0);
			return;
		}

		if (json.telefonos.length === 0) {
			alerta('El telefono no puede quedar vacio', 'warning');
			return;
		}

		if (
			(json.ingresos.length === 0 || isNaN(json.ingresos)) &&
			!json.tipo_cliente
		) {
			alerta('El ingreso no puede quedar vacio', 'warning');
			setTimeout(() => ingresos.focus(), 0);
			return;
		}

		if (!json.archivo_constancia_laboral && !json.tipo_cliente) {
			alerta('La constancia laboral no puede quedar vacia', 'warning');
			return;
		}

		json = {
			...json,
			ingresos: Number(json.ingresos),
			correo_electronico: json.correo,
			telefonos: JSON.stringify(json.telefonos),
		};

		delete json['correo'];

		const formData = new FormData();

		Object.keys(json).forEach(function (key) {
			formData.append(key, json[key]);
		});
		registrando();
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este cliente?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'cliente',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 200) {
						alerta('Se ha registrado el cliente con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-cliente-modal')
						).hide();
						obtenerClientes();
					}
				} catch (error) {
				} finally {
					const btn = document.getElementById('btn-agregar-cliente');
					btn.disabled = false;
				}
			},
			cbn: registrando,
		});
	}

	function editarCliente(json) {
		if (json.dui.length === 0 || json.dui.length < 10) {
			alerta('El DUI no puede quedar vacio o esta incompleto', 'warning');
			setTimeout(() => dui.focus(), 0);
			return;
		}

		if (json.nit.length === 0 || json.nit.length < 17) {
			alerta('El NIT no puede quedar vacio o esta incompleto', 'warning');
			setTimeout(() => nit.focus(), 0);
			return;
		}

		if (json.nombre.length === 0) {
			alerta('El nombre no puede quedar vacio', 'warning');
			setTimeout(() => nombre.focus(), 0);
			return;
		}

		if (json.apellido.length === 0) {
			alerta('El apellido no puede quedar vacio', 'warning');
			setTimeout(() => apellido.focus(), 0);
			return;
		}

		if (json.correo.length === 0 || !validator.isEmail(json.correo)) {
			alerta(
				'El correo no puede quedar vacio o no tiene el formato correcto',
				'warning'
			);
			setTimeout(() => correo.focus(), 0);
			return;
		}

		if (json.direccion.length === 0) {
			alerta('La dirección no puede quedar vacia', 'warning');
			setTimeout(() => direccion.focus(), 0);
			return;
		}

		if (json.telefonos.length === 0) {
			alerta('El telefono no puede quedar vacio', 'warning');
			return;
		}

		if (
			(json.ingresos.length === 0 || isNaN(json.ingresos)) &&
			!json.tipo_cliente
		) {
			alerta('El ingreso no puede quedar vacio', 'warning');
			setTimeout(() => ingresos.focus(), 0);
			return;
		}

		json = {
			...json,
			ingresos: Number(json.ingresos),
			correo_electronico: json.correo,
			telefonos: JSON.stringify(json.telefonos),
		};

		delete json['correo'];

		const formData = new FormData();

		Object.keys(json).forEach(function (key) {
			formData.append(key, json[key]);
		});
		registrando();
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este cliente?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: `cliente/${editarID}`,
						method: 'PUT',
						json: formData,
						archivo: true,
					});
					if (data.status === 200) {
						alerta('Se ha editado el cliente con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-cliente-modal')
						).hide();
						obtenerClientes();
					}
				} catch (error) {}
			},
			cbn: registrando,
		});
	}
})(api, alerta, tabla, confirmacion, select);
