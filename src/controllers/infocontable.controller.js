const { db } = require('../database/db');
const { Cliente } = require('../models/Cliente');
const { InfoContable } = require('../models/InfoContable');
const { TipoCuenta } = require('../models/TipoCuenta');

const obtenerTipoCuenta = async (req, res) => {
	try {
		const tipos = await TipoCuenta.findAll();
		return res.status(200).json({
			tipos,
		});
	} catch (error) {
		return res.status(500).json({ msg: 'Ha ocurrido un error' });
	}
};

const obtenerClientes = async (req, res) => {
	try {
		const clientes = await Cliente.findAll({
			attributes: ['id', 'nombre', 'apellido', 'dui', 'nit'],
			where: {
				tipo_cliente: 1,
			},
		});
		return res.status(200).json({
			clientes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Ha ocurrido un error' });
	}
};

const obtenerInformacion = async (req, res) => {
	try {
		const { cliente } = req.params;
		const informacion = await InfoContable.findAll({
			include: [
				{
					model: TipoCuenta,
				},
			],
			where: {
				cliente_fk: cliente,
			},
		});
		res.status(200).json({
			informacion,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Ha ocurrido un error' });
	}
};

const registrarInfoContable = async (req, res) => {
	try {
		const { clientes } = req.body;
		console.log(clientes);
		db.transaction(async (t) => {
			await InfoContable.bulkCreate(clientes, { transaction: t });
		});
		return res
			.status(200)
			.json({ msg: 'Se ha registrado con exito la información contable' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Ha ocurrido un error' });
	}
};

module.exports = {
	obtenerTipoCuenta,
	obtenerClientes,
	registrarInfoContable,
	obtenerInformacion,
};
