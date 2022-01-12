((api, alerta, tabla, confirmacion, select) => {
	const fecha = document.getElementById('fecha'),
		monto = document.getElementById('monto'),
		total = document.getElementById('total'),
		cliente = document.getElementById('cliente'),
		telefono = document.getElementById('telefono'),
		tipoEmpleo = document.getElementById('tipoEmpleo'),
		lugarTrabajo = document.getElementById('lugarTrabajo'),
		ingreso = document.getElementById('ingreso'),
		archivo = document.getElementById('archivo'),
		fiadorForm = document.getElementById('agregar-form'),
		tituloModal = document.getElementById('agregarModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-modal');
	let idcliente;
	let idpago;
	let fechaMin;
	let cuota;

	const formatDate = (current_datetime) => {
		let formatted_date =
			current_datetime.getDate() +
			'-' +
			(current_datetime.getMonth() + 1) +
			'-' +
			current_datetime.getFullYear() +
			' ' +
			current_datetime.getHours() +
			':' +
			current_datetime.getMinutes() +
			':' +
			current_datetime.getSeconds();
		return formatted_date;
	};

	async function obtenerFiador() {
		try {
			const [resp, data] = await api({
				url: 'pago',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const pagos = resp.pagos;
				console.log(pagos);
				pagos.forEach((pago) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${pago.cartera.cliente.nombre + ' ' + pago.cartera.cliente.apellido}</td>
												<td>${pago.monto}</td>
												<td>${pago.duracion}</td>
												<td>${pago.dia_pago}</td>
												<td>${formatDate(new Date(pago.fecha_aprobacion))}</td>
												<td>${pago.valor_cuota}</td>
												<td>${pago.valor_total}</td>
												<td>
												<button type="button" 
														class="btn btn-warning text-white editar" 
														data-bs-toggle="modal"
														data-bs-target="#agregar-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-id=${pago.id}
														data-idcliente=${pago.cartera.cliente.id}
														data-fecha=${pago.fecha_aprobacion}
														data-cuota=${pago.valor_cuota}
														data-total=${pago.valor_total}
														data-cliente='${
															pago.cartera.cliente.apellido +
															' ' +
															pago.cartera.cliente.apellido
														}'
													>
														<i 
														data-id=${pago.id}
														data-idcliente=${pago.cartera.cliente.id}
														data-fecha=${pago.fecha_aprobacion}
														data-cuota=${pago.valor_cuota}
														data-total=${pago.valor_total}
														data-cliente='${
															pago.cartera.cliente.apellido +
															' ' +
															pago.cartera.cliente.apellido
														}'
															class="bi bi-cart-plus editar"
															></i>
													</button>
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-pago').innerHTML = '';
				document.getElementById('tbody-pago').append(fragmento);
				tabla('tabla-pago');
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

	function editarvehiculo(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este registro?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					if (json.archivo == undefined) {
						const [resp, data] = await api({
							url: `fiador/${idfiador}`,
							method: 'PATCH',
							json,
						});
						if (data.status === 201) {
							combocliente.remove(combocliente.length - 1);
							alerta('Se ha editado el fiador con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-modal')
							).hide();
							obtenerFiador();
						}
					} else {
						const formData = new FormData();

						Object.keys(json).forEach(function (key) {
							formData.append(key, json[key]);
						});
						const [resp, data] = await api({
							url: `fiador/${idfiador}/${idarchivo}`,
							method: 'PATCH',
							json: formData,
							archivo: true,
						});
						if (data.status === 201) {
							alerta('Se ha editado el fiador con exito', 'success');
							bootstrap.Modal.getInstance(
								document.getElementById('agregar-modal')
							).hide();
							obtenerFiador();
						}
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	fiadorForm.addEventListener('submit', registrarFiador);

	document
		.getElementById('agregar-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';
			tituloModal.textContent = 'Agregar Pago';
			fiadorForm.reset();
			select('#combocliente', '#agregar-modal');

			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('agregar-modal')
		.addEventListener('shown.bs.modal', () => {
			nombre.focus();
		});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerFiador();
		obtenerClientes();
	});

	document
		.getElementById('tbody-pago')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar');
			if (!editar) {
				return;
			}
			tituloModal.textContent = 'Nuevo pago';
			btnTexto.textContent = 'Agregar';

			fechaMin = target.dataset.fecha;
			cuota = target.dataset.cuota;
			total.textContent = 'Monto: $' + target.dataset.total;
			cliente.textContent = 'Cliente: ' + target.dataset.cliente;

			idcliente = target.dataset.idcliente;
			idpago = target.dataset.id;
			select('#combocliente', '#agregar-modal');
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});
})(api, alerta, tabla, confirmacion, select);
