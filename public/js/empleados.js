((api, alerta) => {
	const dui = document.getElementById('dui');
	const nombre = document.getElementById('nombre');
	const telefono = document.getElementById('telefono');
	const correo = document.getElementById('correo');
	const usuario = document.getElementById('usuario');
	const clave = document.getElementById('clave');
	const empleadoForm = document.getElementById('agregar-empleado-form');

	document.addEventListener('DOMContentLoaded', () => {
		obtenerEmpleados();
	});

	document
		.getElementById('agregar-empleado-modal')
		.addEventListener('hidden.bs.modal', () => {
			empleadoForm.reset();
		});

	empleadoForm.addEventListener('submit', registrarEmpleado);

	async function registrarEmpleado(e) {
		e.preventDefault();

		const json = {
			dui: dui.value,
			nombre: nombre.value,
			telefono: telefono.value,
			correo: correo.value,
			usuario: usuario.value,
			clave: clave.value,
			empleadoForm: empleadoForm.value,
		};

		if (json.dui.trim().length === 0) {
			return;
		}

		try {
			const [resp, data] = await api({
				url: 'empleado',
				method: 'POST',
				json,
			});
			if (data.status === 201) {
				alerta('Se ha regitrado el empleado con exito', 'success');
				bootstrap.Modal.getInstance(
					document.getElementById('agregar-empleado-modal')
				).hide();
				obtenerEmpleados();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function obtenerEmpleados() {
		try {
			registrando();
			const [resp, data] = await api({
				url: 'empleado',
				method: 'GET',
				json: {},
			});

			if (data.status === 200) {
				empleadoForm.reset();
				const fragmento = document.createDocumentFragment();
				const empleados = resp.empleados;

				empleados.forEach((empleado) => {
					var tpl = document.createElement('template');
					tpl.innerHTML = `
											<tr>
												<td>${empleado.dui}</td>
												<td>${empleado.nombre}</td>
												<td>${empleado.telefono}</td>
												<td>${empleado.usuario}</td>
											</tr>`;
					fragmento.appendChild(tpl.content);
				});
				document.getElementById('tbody-empleados').innerHTML = '';
				console.log(fragmento);
				document.getElementById('tbody-empleados').append(fragmento);
				const datatablesSimple = document.getElementById('tabla-empleados');
				if (datatablesSimple) {
					new simpleDatatables.DataTable(datatablesSimple);
				}
				registrando();
			}
		} catch (error) {
			console.log(error);
		}
	}

	function registrando() {
		const btn = document.getElementById('btn-agregar-empleado');
		btn.disabled = !btn.disabled;
	}
})(api, alerta);
