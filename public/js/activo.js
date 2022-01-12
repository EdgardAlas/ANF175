((api, alerta, tabla, confirmacion, select) => {
	const mostrarmarca = document.getElementById('mostrarmarca'),
		mostrarmodelo = document.getElementById('mostrarmodelo'),
		mostrarserie = document.getElementById('mostrarserie'),
		mtipoactivo = document.getElementById('mtipoactivo'),
		mAdquisicion = document.getElementById('mAdquisicion'),
		mEmpleado = document.getElementById('mEmpleado'),
		activoForm = document.getElementById('agregar-activo-form'),
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
		btnactivoForm = document.getElementById('btn-agregar-activo');
	select('#comboempleado', '#agregar-activo-modal');
	select('#combotipoactivo', '#agregar-activo-modal');

	document
		.getElementById('tabla-activos')
		.addEventListener('click', function ({ target }) {
			const editar = target.classList.contains('mostrar-activo');
			console.log('mostrar');
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

	activoForm.addEventListener('submit', registrarActivo);

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

	document.addEventListener('DOMContentLoaded', () => {
		obtenerActivo();
		obtenerEmpleados();
		obtenertipoactivo();
	});

	async function registrarActivo(e) {
		console.log('pasa2');
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
		console.log(json);

		if (btnTexto.textContent === 'Editar') {
			return editarEmpleado(json);
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
				console.log('empleado=' + empleados);
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

	async function obtenerActivo() {
		console.log('pasa');
		try {
			const [resp, data] = await api({
				url: 'activo',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const activos = resp.activo;
				console.log(resp.activo);
				activos.forEach((activo) => {
					const tpl = document.createElement('template');
					const estado = activo.estado_adquisicion
						? 'Disponible'
						: 'No disponible';
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
														data-dui=${activo.dui}
														data-id=${activo.id}
														data-nombre=${activo.nombre}
														data-telefono=${activo.telefono}
														data-usuario=${activo.usuario}
														data-correo=${activo.correo_electronico}
													>
														<i 
															data-dui=${activo.dui}
															data-id=${activo.id}
															data-nombre=${activo.nombre}
															data-telefono=${activo.telefono}
															data-usuario=${activo.usuario}
															data-correo=${activo.correo_electronico}
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
													data-dui=${activo.dui}
													data-id=${activo.id}
													data-nombre=${activo.nombre}
													data-telefono=${activo.telefono}
													data-usuario=${activo.usuario}
													data-correo=${activo.correo_electronico}
												>
													<i 
														data-dui=${activo.dui}
														data-id=${activo.id}
														data-nombre=${activo.nombre}
														data-telefono=${activo.telefono}
														data-usuario=${activo.usuario}
														data-correo=${activo.correo_electronico}
														class="bi bi-file-excel registrar-baja"
														></i>
												</button>
											</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-activos').innerHTML = '';
				document.getElementById('tbody-activos').append(fragmento);
				tabla('tabla-activos');
			}
		} catch (error) {
			console.log(error);
		}
	}
})(api, alerta, tabla, confirmacion, select);
