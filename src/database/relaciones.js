const { Activo } = require('../models/Activo');
const { Baja } = require('../models/Baja');
const { Cartera } = require('../models/Cartera');
const { Cliente } = require('../models/Cliente');
const { Departamento } = require('../models/Departamento');
const { Empleado } = require('../models/Empleado');
const { Fiador } = require('../models/Fiador');
const { GastosFinancieros } = require('../models/GastosFinancieros');
const { Hipoteca } = require('../models/Hipoteca');
const { InfoContable } = require('../models/InfoContable');
const { Municipio } = require('../models/Municipio');
const { Pago } = require('../models/Pago');
const { Prestamo } = require('../models/Prestamo');
const { Rol } = require('../models/Rol');
const { TasaInteres } = require('../models/TasaInteres');
const { Telefono } = require('../models/Telefono');
const { TipoActivo } = require('../models/TipoActivo');
const { TipoCuenta } = require('../models/TipoCuenta');
const { ZonaDepartamental } = require('../models/ZonaDepartamental');
const { Vehiculo } = require('../models/Vehiculo');

// Ref: rol.id < usuario.rol;

Rol.hasMany(Empleado, {
	foreignKey: 'rol_fk',
});

Empleado.belongsTo(Rol, {
	foreignKey: 'rol_fk',
});

// Ref: usuario.id - empleado.usuario;

// Usuario.hasOne(Empleado, {
// 	foreignKey: 'usuario_fk',
// });

// Empleado.belongsTo(Usuario, {
// 	foreignKey: 'usuario_fk',
// });

// Ref: tipo_activo.id < activo.tipo_activo;

TipoActivo.hasMany(Activo, {
	foreignKey: 'tipo_activo_fk',
});

Activo.belongsTo(TipoActivo, {
	foreignKey: 'tipo_activo_fk',
});

// Ref: empleado.id < activo.empleado;

Empleado.hasMany(Activo, {
	foreignKey: 'empleado_fk',
});

Activo.belongsTo(Empleado, {
	foreignKey: 'empleado_fk',
});

// Ref: activo.id < baja.activo;

Activo.hasMany(Baja, {
	foreignKey: 'activo_fk',
});

Baja.belongsTo(Activo, {
	foreignKey: 'activo_fk',
});

// Ref: departamento.id < municipio.departamento;

Departamento.hasMany(Municipio, {
	foreignKey: 'departamento_fk',
});

Municipio.belongsTo(Departamento, {
	foreignKey: 'departamento_fk',
});

// Ref: municipio.id < cliente.municipio;

Municipio.hasMany(Cliente, {
	foreignKey: 'municipio_fk',
});

Cliente.belongsTo(Municipio, {
	foreignKey: 'municipio_fk',
});

// Ref: cliente.id < telefono.cliente;

Cliente.hasMany(Telefono, {
	foreignKey: 'cliente_fk',
});

Telefono.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: cliente.id < info_contable.cliente;

Cliente.hasMany(InfoContable, {
	foreignKey: 'cliente_fk',
});

InfoContable.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: tipo_cuenta.id < info_contable.tipo_cuenta;

TipoCuenta.hasMany(InfoContable, {
	foreignKey: 'tipo_cuenta_fk',
});

InfoContable.belongsTo(TipoCuenta, {
	foreignKey: 'tipo_cuenta_fk',
});

// Ref: cliente.id < hipoteca.cliente;

Cliente.hasMany(Hipoteca, {
	foreignKey: 'cliente_fk',
});

Hipoteca.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: cliente.id < vehiculo.cliente;

Cliente.hasMany(Vehiculo, {
	foreignKey: 'cliente_fk',
});

Vehiculo.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: cliente.id < fiador.cliente;

Cliente.hasMany(Fiador, {
	foreignKey: 'cliente_fk',
});

Fiador.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: cliente.id < cartera.cliente;

Cliente.hasMany(Cartera, {
	foreignKey: 'cliente_fk',
});

Cartera.belongsTo(Cliente, {
	foreignKey: 'cliente_fk',
});

// Ref: empleado.id < cartera.empleado;

Empleado.hasMany(Cartera, {
	foreignKey: 'empleado_fk',
});

Cartera.belongsTo(Empleado, {
	foreignKey: 'empleado_fk',
});

// Ref: cartera.id < prestamo.cartera;

Cartera.hasMany(Prestamo, {
	foreignKey: 'cartera_fk',
});

Prestamo.belongsTo(Cartera, {
	foreignKey: 'cartera_fk',
});

// Ref: tasa_interes.id < prestamo.tasa_interes;

TasaInteres.hasMany(Prestamo, {
	foreignKey: 'tasa_interes_fk',
});

Prestamo.belongsTo(TasaInteres, {
	foreignKey: 'tasa_interes_fk',
});

// Ref: gastos_financieros.id < prestamo.gastos_financieros;

GastosFinancieros.hasMany(Prestamo, {
	foreignKey: 'gastos_financieros_fk',
});

Prestamo.belongsTo(GastosFinancieros, {
	foreignKey: 'gastos_financieros_fk',
});

// Ref: prestamo.id < pago.prestamo;

Prestamo.hasMany(Pago, {
	foreignKey: 'prestamo_fk',
});

Pago.belongsTo(Prestamo, {
	foreignKey: 'prestamo_fk',
});

// Ref: empleado.id < pago.empleado;

Empleado.hasMany(Pago, {
	foreignKey: 'empleado_fk',
});

Pago.belongsTo(Empleado, {
	foreignKey: 'empleado_fk',
});

// zona < depto

ZonaDepartamental.hasMany(Departamento, {
	foreignKey: 'zona_fk',
});

Departamento.belongsTo(ZonaDepartamental, {
	foreignKey: 'zona_fk',
});
