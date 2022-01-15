const { eliminarSesion } = require('../helpers/crear-sesion');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Empleado } = require('../models/Empleado');
const { Departamento } = require('../models/Departamento');
const { Municipio } = require('../models/Municipio');

const render = (vista) => `autenticacion/${vista}`;

const vistaLogin = async (req, res) => {
	res.render(render('login'));
};

const vistaEmpleados = (req, res) => {
	res.render('empleados/empleados', {
		rol: req.rol,
		pagina: 'empleados',
	});
};

const logout = async (req, res) => {
	eliminarSesion(res);
	res.redirect('/login');
};

const inicio = (req, res) => {
	res.render('inicio', { rol: req.rol, pagina: 'inicio' });
};

const vistaClientes = async (req, res) => {
	let clientes = [];
	let departamentos = [];
	let municipios = [];
	try {
		const empleado = await Empleado.findOne({
			where: {
				id: req.id,
			},
		});

		departamentos = await Departamento.findAll();
		municipios = await Municipio.findAll({
			where: {
				departamento_fk: 1,
			},
		});

		console.log(empleado);
		if (empleado.rol_fk === 1) {
			clientes = await Cliente.findAll();
		} else {
			clientes = await Cartera.findAll({
				include: [
					{
						model: Cliente,
					},
				],
				where: {
					empleado_fk: empleado.id,
				},
			});

			clientes = clientes.map((c) => c.cliente);
			// console.log(clientes);
		}

		// clientes = await Cliente.findAll();
	} catch (error) {
		console.log(error);
	}
	res.render('clientes/clientes', {
		rol: req.rol,
		pagina: 'clientes',
		clientes,
		departamentos,
		municipios,
	});
};

const vistaVehiculos = (req, res) => {
	res.render('vehiculos/vehiculos', {
		rol: req.rol,
		pagina: 'vehiculos',
	});
};

const vistaFiador = (req, res) => {
	res.render('fiador/fiador', {
		rol: req.rol,
		pagina: 'fiador',
	});
};

const vistaPago = (req, res) => {
	res.render('pago/pago', {
		rol: req.rol,
		pagina: 'pago',
	});
};

const vistaCartera = (req, res) => {
	res.render('cartera/cartera', {
		rol: req.rol,
		pagina: 'Cartera de clientes',
	});
};

const vistaHipoteca = (req, res) => {
	res.render('hipoteca/hipoteca', {
		rol: req.rol,
		pagina: 'Hipoteca de clientes',
	});
};

const vistaActivo = (req, res) => {
	res.render('activo/activo', {
		rol: req.rol,
		pagina: 'Activo',
	});
};

const vistaInfoContable = (req, res) => {
	res.render('infocontable/infocontable', {
		rol: 'Administrador',
		pagina: 'Informacion contable',
	});
};

module.exports = {
	vistaLogin,
	logout,
	vistaEmpleados,
	inicio,
	vistaClientes,
	vistaVehiculos,
	vistaCartera,
	vistaHipoteca,
	vistaFiador,
	vistaActivo,
	vistaPago,
	vistaInfoContable,
};
