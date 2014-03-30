var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module){
	var path = module.filename.split('/').slice(-2).join('/');

	var res = new winston.Logger({
		transports: [
			new winston.transports.Console({
				colorize: true,
				level: ENV == 'development' ? 'debug' : 'error' ,
				label: path
			})
		]
	});
	return res;
}

module.exports = getLogger;