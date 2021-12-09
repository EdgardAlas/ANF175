const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const { port } = require('./config/config');

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

	db() {
		// Aca ira la inicializacion de la base de datos
	}

	rutas() {
		this.server.use('/', require('./routes/inicio.route'));
	}

	iniciar() {
		this.db();
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
