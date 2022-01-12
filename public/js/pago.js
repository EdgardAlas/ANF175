((api, alerta, tabla, confirmacion, select) => {
	const fecha = document.getElementById('fecha'),
		monto = document.getElementById('monto'),
		total = document.getElementById('total'),
		cliente = document.getElementById('cliente'),
		pagado = document.getElementById('pagado'),
		restante = document.getElementById('restante'),
		agregar = document.getElementById('btn-agregar'),
		ingreso = document.getElementById('ingreso'),
		archivo = document.getElementById('archivo'),
		fiadorForm = document.getElementById('agregar-form'),
		tituloModal = document.getElementById('agregarModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');
	btnCerrar = document.getElementById('btn-cerrar');
	select('#combocliente', '#agregar-modal');
	let idempleado;
	let idpago;
	let fechaMin;
	let cuota;
	let totales;
	let aux;
	let tbl = null;

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

	function minTwoDigits(n) {
		return (n < 10 ? '0' : '') + n;
	}

	const formatDateInput = (date) => {
		let formatted_date = '';
		var fecha = date; //Fecha actual
		var mes = fecha.getMonth() + 1; //obteniendo mes
		var dia = fecha.getDate(); //obteniendo dia
		var ano = fecha.getFullYear(); //obteniendo año
		var hora = fecha.getHours(); //obteniendo hora
		var minutos = fecha.getMinutes(); //obteniendo minuto
		formatted_date =
			ano +
			'-' +
			minTwoDigits(mes) +
			'-' +
			minTwoDigits(dia) +
			'T' +
			minTwoDigits(hora) +
			':' +
			minTwoDigits(minutos);
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
														data-idempleado=${pago.cartera.empleado_fk}
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
														data-idempleado=${pago.cartera.empleado_fk}
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

	async function obtener(valor) {
		try {
			const [resp, data] = await api({
				url: `pago/real/${valor}`,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const pagos = resp.pagos;
				console.log(pagos);
				aux = 0;
				pagos.forEach((pago) => {
					aux += pago.monto_cuota;
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${pago.monto_cuota}</td>
												<td>${formatDate(new Date(pago.fecha))}</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				pagado.textContent = 'Total pagado: $' + aux;
				restante.textContent = 'Total restante: $' + (totales - aux);
				monto.max = totales - aux;
				monto.value = '';
				fecha.value = formatDateInput(new Date());
				if (aux == totales) {
					agregar.disabled = true;
				} else {
					agregar.disabled = false;
				}
				if (tbl) {
					tbl.clear().destroy();
				}
				document.getElementById('tbody-pagoreal').innerHTML = '';
				document.getElementById('tbody-pagoreal').append(fragmento);
				tbl = tabla('tabla-pagoreal');
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function registrarFiador(e) {
		e.preventDefault();

		if (monto.value < 1) {
			monto.focus();
			return '';
		}

		const json = {
			monto_cuota: monto.value,
			fecha: fecha.value,
			prestamo_fk: idpago,
			empleado_fk: idempleado,
		};
		const formData = new FormData();

		Object.keys(json).forEach(function (key) {
			formData.append(key, json[key]);
		});

		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este pago?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'pago',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 201) {
						alerta('Se ha regitrado el pago con exito', 'success');
						obtener(idpago);
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
			monto.focus();
		});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerFiador();
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
			totales = target.dataset.total;
			idempleado = target.dataset.idempleado;
			idpago = target.dataset.id;

			monto.min = cuota;
			fecha.min = formatDateInput(new Date(fechaMin));
			fecha.value = formatDateInput(new Date());

			total.textContent = 'Monto: $' + target.dataset.total;
			cliente.textContent = 'Cliente: ' + target.dataset.cliente;

			obtener(idpago);
			monto.max = totales - aux;
			select('#combocliente', '#agregar-modal');
			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});
})(api, alerta, tabla, confirmacion, select);
