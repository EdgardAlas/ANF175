((api, alerta, tabla, confirmacion, select) => {
	const mostrarmarca = document.getElementById('mostrarmarca'),
		mostrarmodelo = document.getElementById('mostrarmodelo'),
		mostrarserie = document.getElementById('mostrarserie'),
		mtipoactivo = document.getElementById('mtipoactivo'),
		mAdquisicion = document.getElementById('mAdquisicion'),
		mEmpleado = document.getElementById('mEmpleado'),
		activoForm = document.getElementById('agregar-activo-form'),
		bajaForm = document.getElementById('agregar-baja-form'),
		btnTexto = document.getElementById('btn-texto'),
		tituloModal = document.getElementById('agregarActivoModal'),
		nombreactivo = document.getElementById('nombreactivo'),
		valoractivo = document.getElementById('valoractivo'),
		fecha = document.getElementById('fecha'),
		rmarca = document.getElementById('rmarca'),
		rmodelo = document.getElementById('rmodelo'),
		rserie = document.getElementById('rserie'),
		combotipoactivo = document.getElementById('combotipoactivo'),
		comboadquisicion = document.getElementById('comboadquisicion'),
		comboempleado = document.getElementById('comboempleado'),
		dactivo = document.getElementById('activo'),
		dmensual = document.getElementById('mensual'),
		dvidautil = document.getElementById('vidautil'),
		dfechadq = document.getElementById('dfechadq'),
		dfechasal = document.getElementById('dfechasal'),
		motivo = document.getElementById('motivo'),
		observacion = document.getElementById('observacion'),
		btnbaja = document.getElementById('btn-agregar-baja'),
		btnactivoForm = document.getElementById('btn-agregar-activo');
	let array = [];
	let idactivo;
	let tbl = null;
	select('#comboempleado', '#agregar-activo-modal');
	select('#combotipoactivo', '#agregar-activo-modal');

	document
		.getElementById('tabla-activos')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('mostrar-activo');

			if (!editar) {
				return;
			}
			console.log(target);
			//tituloModal.textContent = 'mostrarHipoteca';

			mostrarmarca.value = target.dataset.marca;
			mostrarmodelo.value = target.dataset.modelo;
			mostrarserie.value = target.dataset.serie;
			mtipoactivo.value = target.dataset.tipo;
			mAdquisicion.value = target.dataset.adquisicion;
			mEmpleado.value = target.dataset.empleado;

			id = target.dataset.id;

			//iconoEditar.classList.add('bi-pencil-square');
			//iconoEditar.classList.remove('bi-check-square');
		});

	document
		.getElementById('tabla-activos')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('registrar-baja');
			motivo.disabled = false;
			observacion.disabled = false;
			btnbaja.disabled = false;
			if (!editar) {
				return;
			}
			id = target.dataset.id;
			console.log(target);
			if (target.dataset.destado == 3) {
				motivo.disabled = true;
				observacion.disabled = true;
				btnbaja.disabled = true;
				//obtenerDetalleBaja();
			}
			//tituloModal.textContent = 'mostrarHipoteca';
			idactivo = target.dataset.rtipoactivo;
			dactivo.value =
				target.dataset.dnombreactivo + ' ' + target.dataset.drmarca;
			dfechadq.value = target.dataset.rfechaadq;

			if (
				target.dataset.rtipoactivo == 1 ||
				target.dataset.rtipoactivo == 3
			) {
				dvidautil.value = '10 años 120 meses';
				dfechasal.value =
					target.dataset.messalida +
					'/' +
					(parseInt(target.dataset.fechasalida) + parseInt(10));
			} else if (target.dataset.rtipoactivo == 2) {
				dvidautil.value = '5 años 60 meses';
				dfechasal.value =
					target.dataset.messalida +
					'/' +
					(parseInt(target.dataset.fechasalida) + parseInt(5));
				calcular(target.dataset.fechasalida, target.dataset.rvaloradq, 5);
			} else if (target.dataset.rtipoactivo == 4) {
				dvidautil.value = '40 años 480 meses';
				dfechasal.value =
					target.dataset.messalida +
					'/' +
					(parseInt(target.dataset.fechasalida) + parseInt(40));
			}

			// document
			// 	.getElementById('btn-darbaja')
			// 	.addEventListener('click', (e) => {
			// 		e.preventDefault();
			// 	});

			const fragmento = document.createDocumentFragment();

			array.forEach((activo) => {
				const tpl = document.createElement('template');
				tpl.innerHTML = `
											<tr>
												<td>${activo.anio}</td>
												<td>${activo.valor}</td>
												<td>${activo.valorfinal}</td>
												</tr>`;
				fragmento.appendChild(tpl.content);
			});
			document.getElementById('tbody-depreciacion').innerHTML = '';
			document.getElementById('tbody-depreciacion').append(fragmento);
			tabla('tabla-depreciacion');

			//iconoEditar.classList.add('bi-pencil-square');
			//iconoEditar.classList.remove('bi-check-square');
		});

	function calcular(anio = 0, monto = 0, vidautil) {
		array = [];
		const anioactual = new Date().getFullYear();
		if (anioactual != anio) {
			const tiempo = parseInt(anioactual) - parseInt(anio);
			let depreciacion;
			let dacumulada = monto;
			for (let i = 0; i < tiempo; i++) {
				console.log(tiempo);
				depreciacion = parseInt(monto) / parseInt(vidautil);
				dacumulada = parseInt(dacumulada) - parseInt(depreciacion);
				array.push({
					anio: parseInt(i) + parseInt(1),
					valor: depreciacion,
					valorfinal: dacumulada,
				});
			}
			dacumulada = 0;
		}
		console.log(array);
	}
	activoForm.addEventListener('submit', registrarActivo);
	bajaForm.addEventListener('submit', registrarBaja);

	document
		.getElementById('agregar-activo-modal')
		.addEventListener('hidden.bs.modal', () => {
			btnTexto.textContent = 'Agregar';

			tituloModal.textContent = 'Agregar Activo';

			activoForm.reset();

			if (iconoEditar.classList.contains('bi-pencil-square')) {
				iconoEditar.classList.remove('bi-pencil-square');
				iconoEditar.classList.add('bi-check-square');
			}
		});

	document
		.getElementById('tbody-activos')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('editar-activo');

			if (!editar) {
				return;
			}
			console.log(target);
			tituloModal.textContent = 'Editar Activo';
			btnTexto.textContent = 'Editar';

			comboadquisicion.value = target.dataset.rtipoadq ? 1 : 2;
			nombreactivo.value = target.dataset.nombreactivo;
			rmarca.value = target.dataset.rmarca;
			rmodelo.value = target.dataset.rmodelo;
			rserie.value = target.dataset.rserie;

			fecha.value = target.dataset.rfechaadq;
			valoractivo.value = target.dataset.rvaloradq;
			combotipoactivo.value = target.dataset.rtipoactivo;
			comboempleado.value = target.dataset.rempleado;
			select('#comboempleado', '#agregar-activo-modal');
			select('#combotipoactivo', '#agregar-activo-modal');
			//idvehiculo = target.dataset.archivo;
			nombreactivo.disabled = true;
			rmarca.disabled = true;
			rmodelo.disabled = true;
			valoractivo.disabled = true;
			rserie.disabled = true;
			fecha.disabled = true;
			combotipoactivo.disabled = true;
			comboadquisicion.disabled = true;

			//combocliente.disabled = true;
			id = target.dataset.id;

			iconoEditar.classList.add('bi-pencil-square');
			iconoEditar.classList.remove('bi-check-square');
		});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerActivo();
		obtenerEmpleados();
		obtenertipoactivo();
	});

	async function registrarBaja(e) {
		e.preventDefault();

		const json = {
			motivo: motivo.value,
			observacion: observacion.value,
			activo_fk: idactivo,
			estado_adquisicion: 3,
		};

		if (btnTexto.textContent === 'Editar') {
			return editarActivo(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de dar de baja este activo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'activo/baja',
						method: 'POST',
						json,
					});
					if (data.status === 201) {
						alerta('Se ha dado de baja el activo fijo ', 'success');
						editarEstadoActivo(json);
						motivo.disabled;
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-baja-modal')
						).hide();
						//obtenerActivo();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	async function registrarActivo(e) {
		e.preventDefault();

		const json = {
			tipo_adquisicion: comboadquisicion.value,
			nombre_activo: nombreactivo.value,
			marca: rmarca.value,
			modelo: rmodelo.value,
			serie: rserie.value,
			fecha_adquisicion: fecha.value,
			valor_adquisicion: valoractivo.value,
			tipo_activo_fk: combotipoactivo.value,
			empleado_fk: comboempleado.value,
		};

		if (btnTexto.textContent === 'Editar') {
			return editarActivo(json);
		}

		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de agregar este activo fijo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'activo',
						method: 'POST',
						json,
					});
					if (data.status === 201) {
						alerta('Se ha regitrado el activo fijo con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-activo-modal')
						).hide();
						obtenerActivo();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	function editarActivo(json = {}) {
		confirmacion({
			icon: 'warning',
			texto: '¿Seguro de editar este activo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					console.log(id);
					const [resp, data] = await api({
						url: `activo/${id}`,
						method: 'PATCH',
						json,
					});

					if (data.status === 201) {
						alerta('Se ha editado el activo con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-activo-modal')
						).hide();
						obtenerActivo();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}

	async function editarEstadoActivo(json = {}) {
		try {
			console.log('id=' + id);
			const [resp, data] = await api({
				url: `activo/estado/${id}`,
				method: 'PATCH',
				json,
			});

			if (data.status === 201) {
				// alerta('Se ha editado el activo con exito', 'success');
				// bootstrap.Modal.getInstance(
				// 	document.getElementById('agregar-activo-modal')
				// ).hide();
				obtenerActivo();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerEmpleados() {
		let url = `activo/empleado`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const select = document.getElementById('comboempleado');
				const empleados = resp.empleado;

				empleados.forEach((cliente) => {
					option = document.createElement('option');
					option.value = cliente.id;
					option.text = cliente.dui + ' ' + cliente.nombre;
					select.appendChild(option);
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenertipoactivo() {
		let url = `activo/tipoactivo`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const select = document.getElementById('combotipoactivo');
				const tipoactivos = resp.tipoactivo;

				tipoactivos.forEach((tactivos) => {
					option = document.createElement('option');
					option.value = tactivos.id;
					option.text =
						tactivos.codigo_correlativo + ' ' + tactivos.nombre;
					select.appendChild(option);
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerDetalleBaja() {
		console.log('id=' + id);
		let url = `activo/detallebaja/${id}`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const baja = resp.baja;
				console.log(baja['motivo']);
				console.log(baja.observacion);
				motivo.value = resp.baja.motivo;
				observacion.value = resp.baja.observacion;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerActivo() {
		try {
			const [resp, data] = await api({
				url: 'activo',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const activos = resp.activo;

				activos.forEach((activo) => {
					const tpl = document.createElement('template');
					const estado =
						activo.estado_adquisicion == 1
							? 'Disponible'
							: activo.estado_adquisicion == 2
							? 'No disponible'
							: 'Dado de Baja';
					const adquisicion = activo.tipo_adquisicion
						? 'Nuevo'
						: 'Restaurado';
					tpl.innerHTML = `
											<tr>
												<td>${activo.nombre_activo}</td>
												<td>${dayjs(activo.fecha_adquisicion).format('DD/MM/YYYY')}</td>
												<td>${activo.valor_adquisicion}</td>
												<td>${estado}</td>
												<td><button 
												type="button" 
												class="btn btn-info text-white mostrar-activo" 
												data-id="${activo.id}"
												data-bs-toggle="modal"
												data-bs-target="#mostrar-activo-modal"
												data-backdrop="static"
												data-keyboard="false"
												data-marca=${activo.marca}
												data-modelo=${activo.modelo}
												data-serie=${activo.serie}
												data-tipo='${activo.tipo_activo.nombre}'
												data-adquisicion=${adquisicion}
												data-empleado='${activo.empleado.nombre}'
												
											>
												<i 
													
													data-id=${activo.id}
													data-marca=${activo.marca}
												   data-modelo=${activo.modelo}
												   data-serie=${activo.serie}
												   data-tipo='${activo.tipo_activo.nombre}'
												data-adquisicion=${adquisicion}
												data-empleado='${activo.empleado.nombre}'
													class="mostrar-activo bi bi-eye-fill"></i>
											</button></td>
												<td>
													<button 
														type="button" 
														class="btn btn-warning text-white editar-activo" 
														data-id="${activo.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-activo-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-nombreactivo=${activo.nombre_activo}
														data-rmarca=${activo.marca}
														data-rmodelo=${activo.modelo}
														data-rserie=${activo.serie}
														data-rtipoadq=${activo.tipo_adquisicion}
														data-rfechaadq='${dayjs(activo.fecha_adquisicion).format('YYYY-MM-DD')}'
														data-rvaloradq=${activo.valor_adquisicion}
														data-rtipoactivo=${activo.tipo_activo_fk}
														data-rempleado=${activo.empleado_fk}
													>
														<i 
														data-nombreactivo=${activo.nombre_activo}
														data-rmarca=${activo.marca}
														data-rmodelo=${activo.modelo}
														data-rserie=${activo.serie}
														data-rtipoadq=${activo.tipo_adquisicion}
														data-rfechaadq='${dayjs(activo.fecha_adquisicion).format('YYYY-MM-DD')}'
														data-rvaloradq=${activo.valor_adquisicion}
														data-rtipoactivo=${activo.tipo_activo_fk}
														data-rempleado=${activo.empleado_fk}
															class="bi bi-pencil-square editar-activo"
															></i>
													</button>
												
												<button 
													type="button" 
													class="btn btn-danger text-white registrar-baja" 
													data-id="${activo.id}"
													data-bs-toggle="modal"
													data-bs-target="#agregar-baja-modal"
													data-backdrop="static"
													data-keyboard="false"
													data-rvaloradq=${activo.valor_adquisicion}
													data-rfechaadq='${dayjs(activo.fecha_adquisicion).format('DD/MM/YYYY')}'
													data-fechasalida=${dayjs(activo.fecha_adquisicion).format('YYYY')}
													data-messalida=${dayjs(activo.fecha_adquisicion).format('DD/MM')}
													data-dnombreactivo=${activo.nombre_activo}
														data-drmarca=${activo.marca}
														data-rtipoactivo=${activo.tipo_activo_fk}
														data-destado=${activo.estado_adquisicion}
														
													
												>
													<i 
													data-rvaloradq=${activo.valor_adquisicion}
													data-rfechaadq='${dayjs(activo.fecha_adquisicion).format('DD/MM/YYYY')}'
														data-fechasalida=${dayjs(activo.fecha_adquisicion).format('YYYY')}
														data-messalida=${dayjs(activo.fecha_adquisicion).format('DD/MM')}
														data-id=${activo.id}
														data-dnombreactivo=${activo.nombre_activo}
														data-drmarca=${activo.marca}
														data-rtipoactivo=${activo.tipo_activo_fk}
														data-destado=${activo.estado_adquisicion}
														
														class="bi bi-file-excel registrar-baja"
														></i>
												</button>
											</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});

				document.getElementById('tbody-activos').innerHTML = '';
				document.getElementById('tbody-activos').append(fragmento);
				if (tbl) {
					tbl.destroy();
				}
				tbl = tabla('tabla-activos');
			}
		} catch (error) {
			console.log(error);
		}
	}

	function calculardepreciacion(int, valor) {
		switch (int) {
			case 1:
				dvidautil.value;
				return valor / 10;
				break;
			case 2:
				return valor / 5;
				break;
			case 3:
				return valor / 10;
				break;
			case 4:
				return valor / 40;
				break;
		}
	}
})(api, alerta, tabla, confirmacion, select);
