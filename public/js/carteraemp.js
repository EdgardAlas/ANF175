((api, alerta, tabla, confirmacion, select) => {
	let tablapago = null;
	const comboempleado = document.getElementById('comboempleado'),
		combocliente = document.getElementById('combocliente'),
		prestamoForm = document.getElementById('agregar-prestamo-form'),
		btnCarteraForm = document.getElementById('btn-agregar-cartera'),
		tituloModal = document.getElementById('agregarCarteraModal'),
		iconoEditar = document.getElementById('icono-editar'),
		monto = document.getElementById('monto'),
		interes = document.getElementById('interes'),
		dia_pago = document.getElementById('diapago'),
		duracion = document.getElementById('duracion'),
		fecha_aprobacion = document.getElementById('fechaaprobacion'),
		valor_cuota = document.getElementById('valor'),
		valor_total = document.getElementById('montofin'),
		gastosfinan = document.getElementById('gastosfinan'),
		btnTexto = document.getElementById('btn-texto'),
		pcliente = document.getElementById('pcliente'),
		btnCerrar = document.getElementById('btn-cerrar');
	let idcartera;
	let activar;
	select('#combocliente', '#agregar-cartera-modal');
	select('#comboempleado', '#agregar-cartera-modal');

	//select('#combocliente');

	document.addEventListener('DOMContentLoaded', () => {
		obtenerCartera();
		//obtenerClientes();
		//obtenerEmpleado();
	});

	prestamoForm.addEventListener('submit', registrarPrestamo);

	document
		.getElementById('tbody-carteraemp')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('agregar-prestamo');
			if (!editar) {
				return;
			}
			idcartera = target.dataset.id;
			interes.value = 0.09;
			interes.disabled = true;
			valor_cuota.disabled = true;
			valor_total.disabled = true;
		});

	document.getElementById('monto').addEventListener('keyup', () => {
		calcularcuota(monto.value, interes.value, duracion.value);
	});

	function calcularcuota(monto, interes, duracion) {
		console.log('monto=' + monto);
		const numerador = parseFloat(interes) * parseFloat(monto);
		const denominador =
			parseInt(1) -
			Math.pow(parseInt(1) + parseFloat(interes), -parseInt(duracion));
		console.log(numerador);
		console.log(denominador);
		console.log(parseFloat(numerador) / parseFloat(denominador));
		valor_cuota.value = (parseFloat(numerador) / parseFloat(denominador))
			.toFixed(2)
			.toLocaleString('es-SV');

		valor_total.value = (
			parseFloat(valor_cuota.value) * parseInt(duracion)
		).toFixed(2);
	}

	// document
	// 	.getElementById('tbody-carteraemp')
	// 	.addEventListener('click', function ({ target }) {
	// 		const editar = target.classList.contains('mostrar-prestamo');
	// 		if (!editar) {
	// 			return;
	// 		}
	// 		pcliente = target.dataset.cliente;
	// 		//idcartera = target.dataset.id;
	// 	});

	async function obtenerCartera() {
		try {
			//registrando();
			const [resp, data] = await api({
				url: 'carteraemp',
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
					if (row.prestamos.length > 0) {
						tpl.innerHTML = `
											<tr>
												<td>${row.id}</td>
												<td>${row.cliente.nombre + ' ' + row.cliente.apellido}</td>
												<td>${tipoCredito}</td>
												
												<td class="d-flex justify-content-center"><a class='btn btn-success' >${estado}</a></td>
												
												<td>
												
												
					
						
													<a 
													type="button"
														class="btn btn-info text-white btnpago" 
														href="/pagoprestamo/${row.id}" 
													>
													<i class="bi bi-wallet2 "></i>
													</a>
													
					
														
												</td>
											</tr>`;
					} else {
						tpl.innerHTML = `
											<tr>
												<td>${row.id}</td>
												<td>${row.cliente.nombre + ' ' + row.cliente.apellido}</td>
												<td>${tipoCredito}</td>
												
												<td class="d-flex justify-content-center"><a class='btn btn-success' >${estado}</a></td>
												
												<td>
												
												<button 
														type="button" 
														class="btn btn-warning text-white agregar-prestamo" 
														data-id=${row.id}
														data-bs-toggle="modal"
														data-bs-target="#agregar-prestamo-modal"
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
															class="bi bi-pencil-square agregar-prestamo"
															></i>
													</button>
													
												</td>
											</tr>`;
					}
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-carteraemp').innerHTML = '';
				document.getElementById('tbody-carteraemp').append(fragmento);
				if (tablapago) {
					tablapago.destroy();
				}
				tablapago = tabla('tabla-carteraemp');

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

	async function obtenerprestamo(idcartera) {
		console.log(idcartera);
		let url = `carteraemp/${idcartera}`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//console.log('OK');

				const prestamo = resp.prestamo;
				console.log(prestamo);
				if (prestamo) {
					activar = true;
					console.log(activar);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function registrarPrestamo(e) {
		e.preventDefault();

		const json = {
			monto: monto.value,
			duracion: duracion.value,
			dia_pago: dia_pago.value,
			fecha_aprobacion: fecha_aprobacion.value,
			valor_cuota: valor_cuota.value,
			valor_total: valor_total.value,
			cartera_fk: idcartera,
		};

		if (btnTexto.textContent === 'Editar') {
			return editarCartera(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar esta prestamo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'carteraemp',
						method: 'POST',
						json,
					});
					if (data.status === 201) {
						//combocliente.remove(combocliente.selectedIndex);
						alerta('Se ha regitrado el prestamo con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-prestamo-modal')
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
