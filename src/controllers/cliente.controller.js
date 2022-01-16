const { Op } = require('sequelize');
const randomstring = require('randomstring');
const path = require('path');
const uuid = require('uuid');

const { db } = require('../database/db');
const { fechaLocal } = require('../helpers/fechas');
const { Cliente } = require('../models/Cliente');
const { Empleado } = require('../models/Empleado');
const { Municipio } = require('../models/Municipio');
const { Telefono } = require('../models/Telefono');
const { Cartera } = require('../models/Cartera');
const Departamento = require('../models/Departamento');

const obtenerMunicipios = async (req, res) => {
	const { municipio } = req.params;
	let municipios = [];
	try {
		municipios = await Municipio.findAll({
			where: {
				departamento_fk: municipio,
			},
		});
	} catch (error) {
		console.log(error);
	}
	return res.status(200).json(municipios);
};

const existeCorreo = async (req, res) => {
	const { id } = req.query;
	const { correo: correo_electronico } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Cliente.findOne({
				where: {
					correo_electronico,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Cliente.findOne({
				where: {
					correo_electronico,
				},
			});
		}
		return res.status(200).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};

const existeDUI = async (req, res) => {
	const { id } = req.query;
	const { dui } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Cliente.findOne({
				where: {
					dui,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Cliente.findOne({
				where: {
					dui,
				},
			});
		}
		return res.status(200).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};

const existeNIT = async (req, res) => {
	const { id } = req.query;
	const { nit } = req.params;

	try {
		let existe = false;
		if (id !== undefined || id) {
			existe = await Cliente.findOne({
				where: {
					nit,
					[Op.not]: {
						id,
					},
				},
			});
		} else {
			existe = await Cliente.findOne({
				where: {
					nit,
				},
			});
		}
		return res.status(200).json({
			existe: !!existe,
		});
	} catch (error) {
		console.log(error);
	}
};

const agregarCliente = async (req, res) => {
	const empleado = await Empleado.findOne({
		where: {
			id: req.id,
		},
	});
	try {
		let guardar = {
			...req.body,
			telefonos: JSON.parse(req.body.telefonos),
			fecha_nacimiento: fechaLocal(req.body.fecha_nacimiento).toDate(),
		};
		let codigo_cliente = '';
		if (guardar.tipo_cliente) {
			codigo_cliente += 'PJ-';
		} else {
			codigo_cliente += 'PN-';
		}

		codigo_cliente += randomstring.generate({
			length: 4,
			charset: 'numeric',
		});

		let filename = null;
		console.log({
			guardar,
		});
		//console.log(req.files.archivo_compra);
		if (req.files) {
			let archivos = req.files.archivo_constancia_laboral;
			filename = uuid.v4() + '.' + archivos.name.replace(/\s/g, '_');
			const uploadPath = path.resolve(
				__dirname,
				'../../uploads/' + filename
			);
			archivos.mv(uploadPath, async function (err) {
				if (err) return res.status(500).send(err);
			});
		}

		guardar = {
			...guardar,
			codigo_cliente,
			archivo_constancia_laboral: filename,
		};

		let cliente = null;
		await db.transaction(async (t) => {
			cliente = await Cliente.create(guardar, {
				include: [
					{
						model: Telefono,
					},
				],
				transaction: t,
			});
		});

		console.log(cliente);
		console.log(empleado);

		if (empleado.rol_fk !== 1) {
			await db.transaction(async (t) => {
				await Cartera.create(
					{
						incobrable: 1,
						cliente_fk: cliente.id,
						empleado_fk: empleado.id,
					},
					{ transaction: t }
				);
			});
		}

		res.status(200).json(guardar);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Ha ocurrido un error al momento de registrar el cliente',
		});
	}
};

const obtenerClientes = async (req, res) => {
	let clientes = [];
	try {
		const empleado = await Empleado.findOne({
			where: {
				id: req.id,
			},
		});
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
	} catch (error) {
		console.log(error);
	}
	res.status(200).json(clientes);
};

const obtenerInformacion = async (req, res) => {
	let cliente = {};
	try {
		cliente = await Cliente.findOne({
			include: [
				{
					model: Telefono,
				},
				{
					model: Municipio,
					include: [
						{
							model: Departamento,
						},
					],
				},
			],
			where: {
				id: req.params.id,
			},
		});
	} catch (error) {
		console.log(error);
	}
	res.status(200).json(cliente);
};

module.exports = {
	obtenerMunicipios,
	existeDUI,
	existeCorreo,
	existeNIT,
	agregarCliente,
	obtenerClientes,
	obtenerInformacion,
};
