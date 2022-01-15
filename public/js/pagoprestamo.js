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

	document.addEventListener('DOMContentLoaded', () => {
		obtenerPago();
	});

	async function obtenerPago() {
		try {
			const [resp, data] = await api({
				url: '',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				const fragmento = document.createDocumentFragment();
				const pago = resp.pago;
				console.log(pago);
				pago.forEach((row) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${row.fecha}</td>
												<td>${row.monto_cuota}</td>
												<td>${row.monto_cuota}</td>
												<td>${row.monto_cuota}</td>
												<td>${row.monto_cuota}</td>
												<td>${row.monto_cuota}</td>
												
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
				document.getElementById('tbody-pagoprestamo').innerHTML = '';
				document.getElementById('tbody-pagoprestamo').append(fragmento);

				tbl = tabla('tabla-pagoprestamo');
			}
		} catch (error) {
			console.log(error);
		}
	}
})(api, alerta, tabla, confirmacion);
