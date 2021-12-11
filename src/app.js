const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { db } = require('./database/db');
const { port } = require('./config/config');
const { Rol } = require('./models/Rol');
const { Usuario } = require('./models/Usuario');
const { Empleado } = require('./models/Empleado');
require('console-error');
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
					rol: 'Adminitrador',
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
			await Usuario.findOrCreate({
				where: { id: '20e29809-de83-4802-8928-a9b0bf88557b' },
				defaults: {
					clave: '$2a$10$3YqgxPbAAhrMQbbatdNL7e7bW4qV/96scb6Ux.MI1hsMTIF6PqgNy',
					usuario: 'admin',
					correo_electronico: 'admin@admin.com',
					estado_usuario: true,
					rol_fk: 1,
				},
			});
			await Empleado.findOrCreate({
				where: { id: 'c98189b2-6c78-41d8-abee-7eef9d1978f2' },
				defaults: {
					usuario_fk: '20e29809-de83-4802-8928-a9b0bf88557b',
					estado_empleado: true,
				},
			});
		} catch (error) {
			console.error(error);
		}
	}

	rutas() {
		// this.server.use('/', require('./routes/inicio.route'));
		this.server.use('/', require('./routes/vistas.route'));
		this.server.use('/api/auth', require('./routes/autenticacion.route'));
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
