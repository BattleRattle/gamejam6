var path = require('path');

exports.index = function (req, res) {
	res.sendfile(path.join(__dirname, '/../../web/index.html'));
};
