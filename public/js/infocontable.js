((api, alerta, tabla, confirmacion, select2) => {
	const agregarInformacion = document.getElementById('agregar-informacion'),
		informacionAgregada = document.getElementById('informacion-agregada'),
		bodyTabla = document.getElementById('tbody-infocontable'),
		comboClientes = document.getElementById('combo-cliente'),
		comboClientesTabla = document.getElementById('combo-cliente-tabla'),
		tiposCuenta = document.getElementById('combo-tipo-cuenta'),
		infoContableForm = document.getElementById('agregar-form'),
		anio = document.getElementById('anio'),
		btnAgregarInfoContable = document.getElementById(
			'btn-agregar-info-contable'
		);
	let tiposCuentaRemovidos = [];
	let tiposCuentaArr = [];
	let infoGuardar = [];
	let codigo = '';
	let tbl = null;

	document.addEventListener('DOMContentLoaded', () => {
		obtenerTiposCuenta();
		iniciarComboTipoCuenta();
		iniciarComboCliente();
		obtenerClientes();
		iniciarComboClienteTabla();
	});

	document
		.getElementById('agregar-infocontable-modal')
		.addEventListener('hidden.bs.modal', () => {
			const fragmento = document.createDocumentFragment();
			tiposCuentaArr.forEach((tipo, indx) => {
				var tpl = document.createElement('template');
				if (indx === 0) {
					tpl.innerHTML = `
												<option value="-1">Seleccione</option>`;
				}
				tpl.innerHTML = `
											<option value="${tipo.id}">${tipo.tipo_cuenta}</option>`;
				fragmento.appendChild(tpl.content);
			});
			tiposCuenta.innerHTML = '';
			informacionAgregada.innerHTML = '';
			tiposCuenta.appendChild(fragmento);
			tiposCuentaRemovidos = [];
			infoGuardar = [];
			comboClientes.value = '-1';
			iniciarComboCliente();
			codigo = '';
			infoContableForm.reset();
		});

	document
		.getElementById('agregar-infocontable-modal')
		.addEventListener('shown.bs.modal', () => {
			codigo = uuidv4();
		});

	infoContableForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		const anio = this.anio.value;

		if (comboClientes.value == '-1') {
			return alerta('Por favor seleccione un cliente', 'danger');
		}

		if (anio.length === 0) {
			return alerta('El año no puede quedar vacio', 'danger');
		}

		if (tiposCuentaRemovidos.length < tiposCuentaArr.length) {
			return alerta('Faltan tipos de cuentas por agregar', 'danger');
		}

		const guardar = infoGuardar.map(({ id, ...g }) => g);

		try {
			const [resp, data] = await api({
				url: 'informacion-contable',
				method: 'POST',
				json: {
					clientes: guardar,
				},
			});

			if (data.status === 200) {
				bootstrap.Modal.getInstance(
					document.getElementById('agregar-infocontable-modal')
				).hide();
				return alerta(
					'Informacion contable registrada con exito',
					'success'
				);
			}
			tabla('tabla-infocontable');
		} catch (error) {}
	});

	btnAgregarInfoContable.addEventListener('click', function (e) {});

	informacionAgregada.addEventListener('input', function (e) {
		const id = e.target.dataset.id;
		const monto = e.target.value.replaceAll('$', '').replaceAll(',', '');
		infoGuardar = infoGuardar.map((info) => {
			if (info.id == id) {
				return {
					...info,
					saldo: monto,
				};
			}
			return info;
		});
	});

	informacionAgregada.addEventListener('click', function (e) {
		const id = e.target.dataset.eliminar;
		if (e.target.classList.contains('eliminar-monto')) {
			infoGuardar = infoGuardar.filter((info) => info.id != id);
			const fragmento = document.createDocumentFragment();
			tiposCuentaRemovidos = tiposCuentaRemovidos.filter(
				(tp) => tp.id != id
			);
			const arr = tiposCuentaArr.filter(
				(x) => !tiposCuentaRemovidos.includes(x)
			);
			let eliminarNodo = null;
			if (e.target.tagName == 'I') {
				eliminarNodo = e.target.parentElement.parentElement.parentElement;
			} else {
				eliminarNodo = e.target.parentElement.parentElement;
			}
			arr.forEach((tipo, indx) => {
				var tpl = document.createElement('template');
				if (indx === 0) {
					tpl.innerHTML = `
												<option value="-1">Seleccione</option>`;
				}
				tpl.innerHTML = `
											<option value="${tipo.id}">${tipo.tipo_cuenta}</option>`;
				fragmento.appendChild(tpl.content);
			});
			tiposCuenta.innerHTML = '';
			tiposCuenta.appendChild(fragmento);
			informacionAgregada.removeChild(eliminarNodo);
		}
	});

	$(comboClientes).on('select2:select', function (e) {
		const cliente_fk = e.target.value;
		infoGuardar = infoGuardar.map((info) => {
			return {
				...info,
				cliente_fk,
			};
		});
	});

	$(comboClientesTabla).on('select2:select', function (e) {
		const cliente_fk = e.target.value;
		obtenerRegistros(cliente_fk);
	});

	anio.addEventListener('change', function (e) {
		const anio = e.target.value;
		infoGuardar = infoGuardar.map((info) => {
			return {
				...info,
				anio,
			};
		});
	});

	agregarInformacion.addEventListener('click', function (e) {
		if (!tiposCuenta.value) {
			return;
		}
		const id = Number(tiposCuenta.value);
		const tipo = tiposCuentaArr.find((tipoCuenta) => tipoCuenta.id === id);
		tiposCuentaRemovidos.push(tipo);
		const eliminar = tiposCuenta.querySelector(`[value="${tipo.id}"]`);
		tiposCuenta.removeChild(eliminar);
		const info = `
						<div class="row mb-2" id='info-${tipo.id}'>
							<div class="col-4 d-flex">
								<span class='fw-bold d-flex align-items-center'>
									${tipo.tipo_cuenta}
								</span>
							</div>
							<div class="col-6 d-flex align-items-center">
							<input type="text" class='form-control info-monto'  min='0' data-id="${tipo.id}"/>
							</div>
							<div class="col-2 d-flex align-items-center">
								<button type='button' class='btn btn-danger text-white btn-sm eliminar-monto' data-eliminar="${tipo.id}"><i class="bi bi-trash eliminar-monto" data-eliminar="${tipo.id}"></i></button>
							</div>
						</div>
						`;
		informacionAgregada.insertAdjacentHTML('beforeend', info);
		infoGuardar.push({
			id: tipo.id,
			saldo: 0,
			anio: anio.value,
			tipo_cuenta_fk: tipo.id,
			cliente_fk: comboClientes.value,
			codigo,
		});
		IMask(document.querySelector(`[data-id="${tipo.id}"]`), {
			mask: '$num',
			blocks: {
				num: {
					mask: Number,
					thousandsSeparator: ',',
					radix: '.',
				},
			},
		});
	});

	async function obtenerRegistros(id) {
		console.log(id);
		try {
			const [resp, data] = await api({
				url: `informacion-contable/obtener-informacion/${id}`,
				method: 'GET',
				json: {},
			});
			if (id == '-1') {
				if (tbl) {
					tbl.destroy();
				}
				bodyTabla.innerHTML = '';
				tbl = tabla('tabla-infocontable');
			} else if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const informacion = resp.informacion;
				console.log(resp);
				let infox = {};
				let aux;

				let tam = 0;

				while (tam < informacion.length) {
					if (tam === 0) {
						aux = informacion[tam].codigo;
						infox[informacion[tam].codigo] = [informacion[tam]];
					} else {
						const existe = infox[informacion[tam].codigo];

						if (existe) {
							infox[informacion[tam].codigo] = [
								...infox[informacion[tam].codigo],
								informacion[tam],
							];
						} else {
							aux = informacion[tam].codigo;
							infox[informacion[tam].codigo] = [informacion[tam]];
						}
					}
					tam++;
				}

				Object.keys(infox).forEach((info) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
										<tr>
											<td>
												${infox[info][0].anio}
											</td>
											<td>
												<button class='btn btn-info text-white' ${infox[info].reduce(
													(prev, curr, arr) => {
														if (curr.tipo_cuenta_fk <= 5) {
															return (prev += `data-${curr.tipo_cuenta_fk}='${curr.tipo_cuentum.tipo_cuenta}|${curr.saldo}' `);
														} else {
															return prev;
														}
													},
													''
												)}><i class="bi bi-eye"></i></button>
											</td>
											<td>
												<button class='btn btn-info text-white' ${infox[info].reduce(
													(prev, curr, arr) => {
														if (curr.tipo_cuenta_fk > 5) {
															return (prev += `data-${curr.tipo_cuenta_fk}='${curr.tipo_cuentum.tipo_cuenta}|${curr.saldo}' `);
														} else {
															return prev;
														}
													},
													''
												)}><i class="bi bi-eye"></i></button>
											</td>
										</tr>
										`;
					fragmento.appendChild(tpl.content);
				});

				if (tbl) {
					tbl.destroy();
				}

				bodyTabla.innerHTML = '';

				bodyTabla.appendChild(fragmento);

				tbl = tabla('tabla-infocontable');
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerTiposCuenta() {
		try {
			const [resp, data] = await api({
				url: 'informacion-contable/obtener-tipos-cuenta',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const tipos = resp.tipos;
				tiposCuentaArr = resp.tipos;

				tipos.forEach((tipo) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<option value="${tipo.id}">${tipo.tipo_cuenta}</option>`;
					fragmento.appendChild(tpl.content);
				});
				tiposCuenta.appendChild(fragmento);
			}
		} catch (error) {}
	}

	async function obtenerClientes() {
		try {
			const [resp, data] = await api({
				url: 'informacion-contable/obtener-clientes',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const clientes = resp.clientes;

				clientes.forEach((tipo) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<option value="${tipo.id}">${tipo.dui ? tipo.dui : tipo.nit} - ${tipo.nombre} ${
						tipo.nombre
					}</option>`;
					fragmento.appendChild(tpl.content);
				});
				comboClientes.appendChild(fragmento);
				obtenerClientesTabla(clientes);
			}
		} catch (error) {}
	}

	async function obtenerClientesTabla(clientes) {
		const fragmento = document.createDocumentFragment();
		clientes.forEach((tipo) => {
			var tpl = document.createElement('template');
			tpl.innerHTML = `
											<option value="${tipo.id}">${tipo.dui ? tipo.dui : tipo.nit} - ${tipo.nombre} ${
				tipo.nombre
			}</option>`;
			fragmento.appendChild(tpl.content);
		});
		comboClientesTabla.appendChild(fragmento);
		if (clientes[0]) {
			comboClientesTabla.value = clientes[0].id;
		}
		$(comboClientesTabla).trigger({
			type: 'select2:select',
		});
	}

	function iniciarComboTipoCuenta() {
		select2('#combo-tipo-cuenta', '#agregar-infocontable-modal');
	}

	function iniciarComboCliente() {
		select2('#combo-cliente', '#agregar-infocontable-modal');
	}
	function iniciarComboClienteTabla() {
		select2('#combo-cliente-tabla', undefined);
	}
})(api, alerta, tabla, confirmacion, select);
