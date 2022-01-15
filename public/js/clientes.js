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
	});

	clientesForm.addEventListener('submit', function (e) {
		e.preventDefault();
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
			municipio: municipio.value,
			tipo_empleo: tipoEmpleo.value == '1',
			ingresos: ingresos.value.replaceAll('$', '').replaceAll(',', ''),
			archivo_constancia_laboral: archivoConstanciaLaboral.files[0],
		};

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
						console.log(data, resp);
						alerta('Se ha registrado el cliente con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-cliente-modal')
						).hide();
						obtenerClientes();
					}
				} catch (error) {
					console.log(error);
				} finally {
					registrando();
				}
			},
		});
	});

	tipoCliente.addEventListener('change', function (e) {
		const tipo = this.value;
		const desabilitado = tipo == '1';
		estadoCivil.disabled = desabilitado;
		tipoEmpleo.disabled = desabilitado;
		ingresos.readOnly = desabilitado;
		archivoConstanciaLaboral.readOnly = desabilitado;
		fechaNacimiento.readOnly = desabilitado;
	});

	correo.addEventListener('keyup', existCorreo);
	dui.addEventListener('keyup', existeDUI);
	nit.addEventListener('keyup', existeNIT);

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
														class="btn btn-info text-white"
														data-id=${cliente.id}
													>
														<i
															class="bi bi-eye mostrar-balance"
															data-id=${cliente.id}
														></i>
													</button>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-empleado" 
														data-bs-toggle="modal"
														data-bs-target="#agregar-empleado-modal"
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
		} catch (error) {
			console.log(error);
		}
	}
})(api, alerta, tabla, confirmacion, select);
