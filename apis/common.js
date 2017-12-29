var fs = require('fs');
var config = require('./config');

function getDir(cb) {
	fs.readdir(config.config.basePath , (err, list) => {
		if (err) {
			console.log('err', err);
			return;
		}
		// console.log('data', list);
		cb && cb(list);
	});
}

module.exports.getDir = getDir;