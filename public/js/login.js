((api) => {
	const mostrarClave = document.querySelector('#mostrar-clave'),
		formLogin = document.querySelector('#form-login'),
		btnSubmit = document.querySelector('#btn-submit'),
		usuario = document.querySelector('#usuario'),
		clave = document.querySelector('#clave'),
		errorUsuario = document.querySelector('#error-usuario'),
		errorClave = document.querySelector('#error-clave');

	let permitirLogin = false;

	document.addEventListener('DOMContentLoaded', () => {});

	mostrarClave.addEventListener('change', ({ target }) => {
		const checked = target.checked;

		if (checked) return (clave.type = 'text');
		clave.type = 'password';
	});

	usuario.addEventListener('keyup', validarLogin);
	clave.addEventListener('keyup', validarLogin);

	formLogin.addEventListener('submit', login);

	btnSubmit.addEventListener('click', (e) => e.target.blur());

	async function login(e) {
		e.preventDefault();

		if (!permitirLogin) {
			return alerta('Rellene los campos obligatorios', 'danger');
		}

		const usuario = e.target.usuario.value;
		const clave = e.target.clave.value;
		cargando();
		try {
			// auth / login;
			console.log({
				usuario,
				clave,
			});
			const [res, data] = await api('auth/login', {
				usuario,
				clave,
			});

			cargando();

			if (data.status === 400) {
				for (const err of res.errores) {
					const error = Object.values(err)[0];
					alerta(error, 'danger');
				}

				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	function validarLogin({ target }) {
		const inputName = target.name;
		const vacioUsuario = usuario.value.trim().length === 0;
		const vacioClave = clave.value.trim().length === 0;

		if (inputName === 'usuario' && vacioUsuario) {
			errorUsuario.classList.add('d-block');
			usuario.classList.add('is-invalid');
		} else if (
			inputName === 'usuario' &&
			errorUsuario.classList.contains('d-block')
		) {
			errorUsuario.classList.remove('d-block');
			usuario.classList.remove('is-invalid');
		}

		if (inputName === 'clave' && vacioClave) {
			errorClave.classList.add('d-block');
			clave.classList.add('is-invalid');
		} else if (
			inputName === 'clave' &&
			errorClave.classList.contains('d-block')
		) {
			errorClave.classList.remove('d-block');
			clave.classList.remove('is-invalid');
		}

		permitirLogin = !vacioUsuario && !vacioClave;
	}

	function cargando() {
		const spinner = document.getElementById('cargando');
		spinner.classList.toggle('d-none');
		btnSubmit.disabled = !btnSubmit.disabled;
	}
})(api, alerta);
