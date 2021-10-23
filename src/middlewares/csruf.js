const csurf = require('csurf');

const csrfProteccion = csurf({ cookie: true });

module.exports = csrfProteccion;
