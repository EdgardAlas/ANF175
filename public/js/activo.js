((api, alerta, tabla, confirmacion) => {
	const mostrarmarca = document.getElementById('mostrarmarca'),
		mostrarmodelo = document.getElementById('mostrarmodelo'),
		mostrarserie = document.getElementById('mostrarserie'),
		mtipoactivo = document.getElementById('mtipoactivo'),
		mAdquisicion = document.getElementById('mAdquisicion');
	mEmpleado = document.getElementById('mEmpleado');

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

	document.addEventListener('DOMContentLoaded', () => {
		obtenerActivo();
	});

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
})(api, alerta, tabla, confirmacion);
