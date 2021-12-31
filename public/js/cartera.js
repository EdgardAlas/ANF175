((api, alerta, tabla, confirmacion) => {
	document.addEventListener('DOMContentLoaded', () => {
		obtenerCartera();
	});
	async function obtenerCartera() {
		try {
			//registrando();
			const [resp, data] = await api({
				url: 'cartera',
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
					tpl.innerHTML = `
											<tr>
												
												<td>${row.cliente.nombre + ' ' + row.cliente.apellido}</td>
												<td>${tipoCredito}</td>
												<td>${row.empleado.nombre}</td>
												<td class="d-flex justify-content-center"><button type="button" class='btn btn-success'>${estado}</button></td>
												
												<td>
												
												<button 
														type="button" 
														class="btn btn-warning text-white editar-row" 
														data-id="${row.id}"
														data-bs-toggle="modal"
														data-bs-target="#agregar-row-modal"
														data-backdrop="static"
														data-keyboard="false"
														data-combocliente=${row.cliente.id}
														data-nombre=${row.nombre}
														data-dui=${row.dui}
														data-id=${row.id}
														data-marca=${row.marca}
														data-modelo=${row.modelo}
														data-anio=${row.anio}
														data-valor=${row.valor}
														data-direccion=${row.direccion} 
														data-archivo=${row.archivo_compra}
													>
														<i 
														data-combocliente=${row.cliente.id}
															data-nombre=${row.nombre}
															data-dui=${row.dui}
															data-id=${row.id}
															data-marca=${row.marca}
															data-modelo=${row.modelo}
															data-anio=${row.anio}
															data-valor=${row.valor}
															data-direccion=${row.direccion}
															data-archivo=${row.archivo_compra}
															class="bi bi-pencil-square editar-row"
															></i>
													</button>
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-cartera').innerHTML = '';
				document.getElementById('tbody-cartera').append(fragmento);
				tabla('tabla-cartera');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}
})(api, alerta, tabla, confirmacion);
