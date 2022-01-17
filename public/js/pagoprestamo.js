((api, alerta, tabla, confirmacion) => {
	let tbl = null;
	let tblpago = null;
	let idempleado;
	let idpago;
	let fechaMin;
	let cuota;
	let totales;
	let aux;
	let saldoactual = montoprestamo.value;
	let interesacumulado = 0;
	let totalinteres;
	let totalsaldo;
	let primerafecha = new Date();
	let fechafutura = new Date();
	const monto = document.getElementById('monto'),
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
	idprestamo = document.getElementById('idprestamo');
	idempleado = document.getElementById('idempleado');
	interes = document.getElementById('interes');
	interesacum = document.getElementById('interesacum');
	montoprestamo = document.getElementById('montoprestamo');
	diapago = document.getElementById('diapago');
	fechaapro = document.getElementById('fechaapro');
	fechaacum = document.getElementById('fechaacum');
	valorcuota = document.getElementById('valorcuota');
	montofin = document.getElementById('montofin');
	let formato;

	document.addEventListener('DOMContentLoaded', () => {
		formato = fechaapro.value;
		fechaapro.value = dayjs(formato).format('DD/MM/YYYY');
		obtenerPago();
		total.textContent = 'Monto: $' + montoprestamo.value;
		primerafecha = diapago + '/' + dayjs(fechaapro).format('MM/YYYY');

		//obtenerFiador();
	});

	document.getElementById('monto').addEventListener('keyup', () => {
		restante.textContent =
			'Total restante: $' + (saldoactual - monto.value).toFixed(2);
	});

	//alert(montofin.value - montoprestamo.value, 'success');

	fiadorForm.addEventListener('submit', registrarPago);

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
			if (interesacum.value == montofin.value - montoprestamo.value) {
				interes.disabled = true;
				interes.value = 0;
			}
			monto.focus();
		});

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

	async function obtenerPago() {
		try {
			const [resp, data] = await api({
				url: `pago/${idprestamo.value}`,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const pago = resp.pagos;
				console.log(saldoactual);
				pago.forEach((row) => {
					const date1 = dayjs(fechaacum.value).add(1, 'month');

					console.log('resta=', date1.isAfter(row.fecha));
					if (!date1.isAfter(row.fecha)) {
						const mora = (valorcuota.value * 0.03).toFixed(2);
						row.saldo_mora = mora;
						const saldo = parseFloat(row.saldo_actual) + parseFloat(mora);
						row.saldo_actual = saldo;
					}
					saldoactual = row.saldo_actual;
					interesacumulado = interesacumulado + row.interes;
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${dayjs(date1).format('DD/MM/YYYY')}</td>
												<td>${dayjs(row.fecha).format('DD/MM/YYYY')}</td>
												<td>${(row.monto_cuota + row.saldo_actual).toFixed(2)}</td>
												<td>${row.monto_cuota}</td>
												<td>${row.interes}</td>
												<td>${row.saldo_mora}</td>
												<td>${row.saldo_actual}</td>

												<td>
													
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
					fechaacum.value = date1;
				});
				interesacum.value = interesacumulado;
				if (tblpago) {
					tblpago.destroy();
				}
				document.getElementById('tbody-pagoprestamo').innerHTML = '';
				document.getElementById('tbody-pagoprestamo').append(fragmento);

				tblpago = tabla('tabla-pagoprestamo');
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function registrarPago(e) {
		e.preventDefault();
		fechaacum.value = dayjs(formato);
		console.log(parseFloat(interesacum.value) + parseFloat(interes.value));
		console.log(montofin.value - montoprestamo.value);
		if (
			parseFloat(interesacum.value) + parseFloat(interes.value) >
			montofin.value - montoprestamo.value
		) {
			interes.max = montofin.value - montoprestamo.value;
			interes.value = '';
			return;
		}

		if (monto.value < 1) {
			monto.focus();
			return '';
		}

		const json = {
			monto_cuota: monto.value,
			fecha: fecha.value,
			prestamo_fk: idprestamo.value,
			empleado_fk: idempleado.value,
			interes: interes.value,
			saldo_actual: saldoactual - monto.value,
			saldo_mora: 0,
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
						console.log(resp.pago);
						alerta('Se ha regitrado el pago con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-modal')
						).hide();
						obtenerPago();
						//obtener(idpago);
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	async function obtener(valor) {
		console.log('valor=' + valor);
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
				//monto.max = totales - aux;
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
	function minTwoDigits(n) {
		return (n < 10 ? '0' : '') + n;
	}
})(api, alerta, tabla, confirmacion);
