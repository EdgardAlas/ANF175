const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');

dayjs.extend(utc);
dayjs.extend(timezone);
const zona = dayjs.tz.guess();

const fechaLocal = (fecha = new Date()) => dayjs(fecha).tz(zona);
const fecha = () => dayjs().tz(zona);

console.log(fechaLocal().format('YYYY-MM-DD hh:mm:ss'));
module.exports = {
	dayjs: dayjs.tz,
	zona,
	fechaLocal,
	fecha,
};
