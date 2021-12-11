(() => {
	const mostrarClave = document.querySelector('#mostrar-clave'),
		formLogin = document.querySelector('#form-login'),
		btnSubmit = document.querySelector('#btn-submit'),
		usuario = document.querySelector('#usuario'),
		clave = document.querySelector('#clave');

	document.addEventListener('DOMContentLoaded', () => {});

	mostrarClave.addEventListener('change', ({ target }) => {
		const checked = target.checked;

		if (checked) return (clave.type = 'text');
		clave.type = 'password';
	});

	formLogin.addEventListener('submit', (e) => {
		e.preventDefault();
	});

	btnSubmit.addEventListener('click', (e) => e.target.blur());
})();
