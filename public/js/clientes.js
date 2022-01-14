((api, alerta, tabla, confirmacion) => {
	document.addEventListener('DOMContentLoaded', () => {
		// obtenerEmpleados();
		tabla('tabla-clientes');
	});

	// async function obtenerEmpleados() {
	// 	try {
	// 		registrando();
	// 		const [resp, data] = await api({
	// 			url: 'empleado',
	// 			method: 'GET',
	// 			json: {},
	// 		});

	// 		if (data.status === 200) {
	// 			empleadoForm.reset();
	// 			const fragmento = document.createDocumentFragment();
	// 			const empleados = resp.empleados;

	// 			empleados.forEach((empleado) => {
	// 				var tpl = document.createElement('template');
	// 				tpl.innerHTML = `
	// 										<tr>
	// 											<td>${empleado.dui}</td>
	// 											<td>${empleado.nombre}</td>
	// 											<td>${empleado.telefono}</td>
	// 											<td>${empleado.usuario}</td>
	// 											<td>
	// 												<button
	// 													type="button"
	// 													class="btn btn-warning text-white editar-empleado"
	// 													data-id="${empleado.id}"
	// 													data-bs-toggle="modal"
	// 													data-bs-target="#agregar-empleado-modal"
	// 													data-backdrop="static"
	// 													data-keyboard="false"
	// 													data-dui=${empleado.dui}
	// 													data-id=${empleado.id}
	// 													data-nombre=${empleado.nombre}
	// 													data-telefono=${empleado.telefono}
	// 													data-usuario=${empleado.usuario}
	// 													data-correo=${empleado.correo_electronico}
	// 												>
	// 													<i
	// 														data-dui=${empleado.dui}
	// 														data-id=${empleado.id}
	// 														data-nombre=${empleado.nombre}
	// 														data-telefono=${empleado.telefono}
	// 														data-usuario=${empleado.usuario}
	// 														data-correo=${empleado.correo_electronico}
	// 														class="bi bi-pencil-square editar-empleado"
	// 														></i>
	// 												</button>
	// 											</td>
	// 										</tr>`;
	// 				fragmento.appendChild(tpl.content);
	// 			});
	// 			if (tbl) {
	// 				tbl.destroy();
	// 			}
	// 			document.getElementById('tbody-empleados').innerHTML = '';
	// 			document.getElementById('tbody-empleados').append(fragmento);

	// 			tbl = tabla('tabla-empleados');

	// 			registrando();
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	function registrando() {
		const btn = document.getElementById('btn-agregar-empleado');
		btn.disabled = !btn.disabled;
	}
})(api, alerta, tabla, confirmacion);
