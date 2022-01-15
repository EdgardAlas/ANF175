const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { db } = require('./database/db');
const { port } = require('./config/config');
const { Rol } = require('./models/Rol');
const { Empleado } = require('./models/Empleado');
const { Departamento } = require('./models/Departamento');
const { Municipio } = require('./models/Municipio');
const { ZonaDepartamental } = require('./models/ZonaDepartamental');
const zonas = require('./data/zonas');
const departamentos = require('./data/departamentos');
const municipios = require('./data/municipios');
const { TipoCuenta } = require('./models/TipoCuenta');
require('./database/relaciones');

class App {
	constructor() {
		this.server = express();
	}

	middlewares() {
		this.server.use(cookieParser());
		this.server.use(
			cors({
				credentials: true,
				methods: ['PUT', 'DELETE', 'POST', 'GET', 'PATCH'],
			})
		);
		this.server.use(helmet({ contentSecurityPolicy: false }));
		this.server.use(express.urlencoded({ extended: false, limit: '2gb' }));
		this.server.use(express.json({ limit: '2gb' }));
		this.server.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				preserveExtension: true,
				createParentPath: true,
			})
		);
		this.server.use(express.static(path.resolve(__dirname, '../public')));
		this.server.set('view engine', 'ejs');
		this.server.set('views', path.resolve(__dirname, './views'));
	}

	async baseDatos() {
		// Aca ira la inicializacion de la base de datos
		try {
			await db.sync({
				force: false,
			});
			await Rol.findOrCreate({
				where: { id: 1 },
				defaults: {
					rol: 'Administrador',
				},
			});
			await Rol.findOrCreate({
				where: { id: 2 },
				defaults: {
					rol: 'Usuario',
				},
			});
			await Rol.findOrCreate({
				where: { id: 3 },
				defaults: {
					rol: 'Vendedor',
				},
			});
			await Empleado.findOrCreate({
				where: { id: 'c98189b2-6c78-41d8-abee-7eef9d1978f2' },
				defaults: {
					estado_empleado: true,
					clave: '$2a$10$3YqgxPbAAhrMQbbatdNL7e7bW4qV/96scb6Ux.MI1hsMTIF6PqgNy',
					usuario: 'admin',
					correo_electronico: 'admin@admin.com',
					rol_fk: 1,
				},
			});

			await ZonaDepartamental.bulkCreate(zonas, {
				fields: ['id', 'zona'],
				updateOnDuplicate: ['zona'],
			});

			await Departamento.bulkCreate(departamentos, {
				fields: ['id', 'departamento', 'zona_fk'],
				updateOnDuplicate: ['departamento'],
			});

			await Municipio.bulkCreate(municipios, {
				fields: ['id', 'municipio', 'departamento_fk'],
				updateOnDuplicate: ['municipio'],
			});

			await TipoCuenta.bulkCreate(
				[
					{
						id: 1,
						tipo_cuenta: 'Activo Corriente',
					},
					{
						id: 2,
						tipo_cuenta: 'Activo No Corriente',
					},
					{
						id: 3,
						tipo_cuenta: 'Pasivo Corriente',
					},
					{
						id: 4,
						tipo_cuenta: 'Pasivo No Corriente',
					},
					{
						id: 5,
						tipo_cuenta: 'Patrimonio',
					},
					{
						id: 6,
						tipo_cuenta: 'Ventas netas',
					},
					{
						id: 7,
						tipo_cuenta: 'Total de gastos',
					},
					{
						id: 8,
						tipo_cuenta: 'Utilidad',
					},
				],
				{
					fields: ['id', 'tipo_cuenta'],
					updateOnDuplicate: ['tipo_cuenta'],
				}
			);
		} catch (error) {
			console.error(error);
		}
	}

	rutas() {
		// this.server.use('/', require('./routes/inicio.route'));
		this.server.use('/', require('./routes/vistas.route'));
		this.server.use('/api/auth', require('./routes/autenticacion.route'));
		this.server.use('/api/empleado', require('./routes/empleados.route'));
		this.server.use('/api/vehiculo', require('./routes/vehiculos.route'));
		this.server.use('/api/cartera', require('./routes/cartera.route'));
		this.server.use('/api/hipoteca', require('./routes/hipoteca.route'));
		this.server.use('/api/fiador', require('./routes/fiador.route'));
		this.server.use('/api/activo', require('./routes/activo.route'));
		this.server.use('/api/pago', require('./routes/pago.route'));
		this.server.use('/api/cliente', require('./routes/cliente.route'));
		this.server.use(
			'/api/informacion-contable',
			require('./routes/infocontable.route')
		);
		this.server.use('*', (req, res) => {
			res.status(404).render('errores/no-encontrado');
		});
	}

	iniciar() {
		this.baseDatos();
		this.middlewares();
		this.rutas();

		this.server.listen(port, () => {
			console.log('Servidor iniciado');
		});
	}
}

module.exports = {
	App,
};
