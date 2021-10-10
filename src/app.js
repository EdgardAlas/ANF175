const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');

const { port } = require('./config/config');

class App {
	constructor() {
		this.server = express();
	}

	middlewares() {
		this.server.use(cors());
		this.server.use(helmet());
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
