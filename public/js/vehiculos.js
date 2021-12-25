((api, alerta, tabla, confirmacion) => {
	const dui = document.getElementById('dui'),
		combocliente = document.getElementById('combocliente'),
		nombre = document.getElementById('nombre'),
		marca = document.getElementById('marca'),
		modelo = document.getElementById('modelo'),
		anio = document.getElementById('anio'),
		valor = document.getElementById('valor'),
		direccion = document.getElementById('direccion'),
		archivo_compra = document.getElementById('archivo_compra'),
		vehiculoForm = document.getElementById('agregar-vehiculo-form'),
		btnvehiculoForm = document.getElementById('btn-agregar-vehiculo'),
		tituloModal = document.getElementById('agregarVehiculoModal'),
		iconoEditar = document.getElementById('icono-editar'),
		btnTexto = document.getElementById('btn-texto');

	const mascaraDUI = IMask(dui, {
		mask: '00000000-0',
	});

	const mascaraNombre = IMask(nombre, {
		mask: /^[a-zA-Z\s]*$/,
	});

	document.addEventListener('DOMContentLoaded', () => {
		obtenerVehiculos();
		obtenerClientes();
	});

	async function obtenerVehiculos() {
		try {
			//registrando();
			const [resp, data] = await api({
				url: 'vehiculo',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//vehiculoForm.reset();
				const fragmento = document.createDocumentFragment();
				const vehiculos = resp.vehiculos;
				vehiculos.forEach((vehiculo) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${vehiculo.cliente.nombre + ' ' + vehiculo.cliente.apellido}</td>
												<td>${vehiculo.marca}</td>
												<td>${vehiculo.modelo}</td>
												<td>${vehiculo.anio}</td>
												<td>${vehiculo.valor}</td>
												<td>${vehiculo.nombre}</td>
												<td><a href='/api/vehiculo/obtener-archivo/${
													vehiculo.archivo_compra
												}' target='_blank'>Ver documento</a></td>
												<td>
												
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-vehiculos').innerHTML = '';
				document.getElementById('tbody-vehiculos').append(fragmento);
				tabla('tabla-vehiculos');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerClientes() {
		let url = `vehiculo/cliente`;
		try {
			//registrando();
			const [resp, data] = await api({
				url,
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				//console.log('OK');
				const select = document.getElementById('combocliente');
				const clientes = resp.clientes;
				clientes.forEach((cliente) => {
					option = document.createElement('option');
					option.value = cliente.id;
					option.text = cliente.nombre + ' ' + cliente.apellido;
					select.appendChild(option);
				});
				//document.getElementById('cliente').innerHTML = '';
				//document.getElementById('cliente').append(fragmento);
				//tabla('tabla-vehiculos');

				//registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	vehiculoForm.addEventListener('submit', registrarVehiculo);

	async function registrarVehiculo(e) {
		e.preventDefault();
		let cliente_fk = combocliente.value;

		const json = {
			dui: dui.value,
			nombre: nombre.value,
			marca: marca.value,
			modelo: modelo.value,
			anio: anio.value,
			valor: valor.value,
			direccion: direccion.value,
			archivo_compra: archivo_compra.files[0],
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
			texto: '¿Seguro de agregar este vehículo?',
			titulo: 'Advertencia',
			cb: async function () {
				try {
					const [resp, data] = await api({
						url: 'vehiculo',
						method: 'POST',
						json: formData,
						archivo: true,
					});
					if (data.status === 201) {
						alerta('Se ha regitrado el vehiculo con exito', 'success');
						bootstrap.Modal.getInstance(
							document.getElementById('agregar-vehiculo-modal')
						).hide();
						obtenerVehiculos();
					}
				} catch (error) {
					console.log(error);
				}
			},
		});
	}
})(api, alerta, tabla, confirmacion);
