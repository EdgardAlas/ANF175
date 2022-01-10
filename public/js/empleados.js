((api, alerta, tabla, confirmacion) => {
	const dui = document.getElementById('dui'),
		nombre = document.getElementById('nombre'),
		telefono = document.getElementById('telefono'),
		correo = document.getElementById('correo'),
		usuario = document.getElementById('usuario'),
		clave = document.getElementById('clave'),
		empleadoForm = document.getElementById('agregar-empleado-form'),
		btnEmpleadoForm = document.getElementById('btn-agregar-empleado'),
		tituloModal = document.getElementById('agregarEmpleadoModal'),
		mostrarClave = document.getElementById('mostrar-clave'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');

	let id = '';
	let tbl = null;

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

	document.addEventListener('DOMContentLoaded', () => {
		obtenerEmpleados();
	});

	correo.addEventListener('keyup', existCorreo);

	dui.addEventListener('keyup', existeDUI);

	usuario.addEventListener('keyup', existeUsuario);

	mostrarClave.addEventListener('change', ({ target }) => {
		const checked = target.checked;

		if (checked) return (clave.type = 'text');
		clave.type = 'password';
	});

	document
		.getElementById('tbody-empleados')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar-empleado');
			if (!editar) {
				return;
			}
			tituloModal.textContent = 'Editar empleado';
			btnTexto.textContent = 'Editar';
			dui.value = target.dataset.dui;
			nombre.value = target.dataset.nombre;
			telefono.value = target.dataset.telefono;
			usuario.value = target.dataset.usuario;
			correo.value = target.dataset.correo;
			id = target.dataset.id;
			clave.required = false;
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	document
		.getElementById('agregar-empleado-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';
			clave.type = 'password';
			tituloModal.textContent = 'Agregar empleado';
			clave.required = true;
			empleadoForm.reset();
			mascaraDUI.updateValue();
			mascaraNombre.updateValue();
			mascaraTelefono.updateValue();
			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('agregar-empleado-modal')
		.addEventListener('shown.bs.modal', () => {
			dui.focus();
		});

	empleadoForm.addEventListener('submit', registrarEmpleado);

	async function registrarEmpleado(e) {
		e.preventDefault();

		const json = {
			dui: dui.value,
			nombre: nombre.value,
			telefono: telefono.value,
			correo: correo.value,
			usuario: usuario.value,
			clave: clave.value,
			empleadoForm: empleadoForm.value,
		};

		if (btnTexto.textContent === 'Editar') {
			return editarEmpleado(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este empleado?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'empleado',
						method: 'POST',
						json,
					});
					if (data.status === 201) {
						alerta('Se ha regitrado el empleado con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-empleado-modal')
						).hide();
						obtenerEmpleados();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	function editarEmpleado(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este registro?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: `empleado/${id}`,
						method: 'PATCH',
						json,
					});
					if (data.status === 201) {
						alerta('Se ha editado el empleado con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-empleado-modal')
						).hide();
						obtenerEmpleados();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	async function obtenerEmpleados() {
		try {
			registrando();
			const [resp, data] = await api({
				url: 'empleado',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				empleadoForm.reset();
				const fragmento = document.createDocumentFragment();
				const empleados = resp.empleados;

				empleados.forEach((empleado) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${empleado.dui}</td>
												<td>${empleado.nombre}</td>
												<td>${empleado.telefono}</td>
												<td>${empleado.usuario}</td>
												<td>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-empleado" 
														data-id="${empleado.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-empleado-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-dui=${empleado.dui}
														data-id=${empleado.id}
														data-nombre=${empleado.nombre}
														data-telefono=${empleado.telefono}
														data-usuario=${empleado.usuario}
														data-correo=${empleado.correo_electronico}
													>
														<i 
															data-dui=${empleado.dui}
															data-id=${empleado.id}
															data-nombre=${empleado.nombre}
															data-telefono=${empleado.telefono}
															data-usuario=${empleado.usuario}
															data-correo=${empleado.correo_electronico}
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
				document.getElementById('tbody-empleados').innerHTML = '';
				document.getElementById('tbody-empleados').append(fragmento);

				tbl = tabla('tabla-empleados');

				registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	function registrando() {
		const btn = document.getElementById('btn-agregar-empleado');
		btn.disabled = !btn.disabled;
	}

	async function existCorreo({ target }) {
		if (correo.value.trim().length === 0) {
			return;
		}

		let url = `empleado/correo/${correo.value}`;
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
		} catch (error) {
			console.log(error);
		}
	}

	async function existeDUI() {
		if (dui.value.trim().length === 0) {
			return;
		}

		let url = `empleado/dui/${dui.value}`;
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

	async function existeUsuario() {
		if (usuario.value.trim().length === 0) {
			return;
		}

		let url = `empleado/usuario/${usuario.value}`;
		if (btnTexto.textContent === 'Editar') {
			url += `?id=${id}`;
		}
		try {
			const [resp, data] = await api({
				url,
				method: 'GET',
			});
			if (resp.existe) {
				alerta('Este usuario ya esta en uso', 'warning');
				usuario.value = '';
				usuario.focus();
			}
		} catch (error) {
			console.log(error);
		}
	}
})(api, alerta, tabla, confirmacion);
