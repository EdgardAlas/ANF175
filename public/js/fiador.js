document.addEventListener('DOMContentLoaded', () => {
	obtenerVehiculos();
});

async function obtenerVehiculos() {
	try {
		//registrando();
		const [resp, data] = await api({
			url: 'fiador',
			method: 'GET',
			json: {},
		});

		if (data.status === 200) {
			//vehiculoForm.reset();
			const fragmento = document.createDocumentFragment();
			const fiadors = resp.fiador;
			console.log(fiadors),
				fiadors.forEach((fiador) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												
												<td>${fiador.cliente.nombre + ' ' + fiador.cliente.apellido}</td>
												<td>${fiador.nombre}</td>
												<td>${fiador.dui}</td>
												<td>${fiador.direccion}</td>
												<td>${fiador.telefono}</td>
												<td>${fiador.tipo_empleo}</td>
												<td>${fiador.lugar_trabajo}</td>
												<td>${fiador.ingresos}</td>
												<td><a href='/api/fiador/obtener-archivo/${
													fiador.archivo_const_laboral
												}' target='_blank'>Ver documento</a></td>
												<td>
												<button 
													>
													</button>
														
												</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
			document.getElementById('tbody-fiador').innerHTML = '';
			document.getElementById('tbody-fiador').append(fragmento);
			tabla('tabla-fiador');

			//registrando();
		}
	} catch (error) {
		console.log(error);
	}
}
