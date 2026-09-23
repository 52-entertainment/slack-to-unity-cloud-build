const yaml = require('yaml');
const {readFileSync} = require('fs');
const express = require('express');
const path = require('path');
const app = express();
global.config = yaml.parse(readFileSync('config.yaml', 'utf8'))

const port = config.port || process.env.port || 4000


app.use(express.json());          // to support JSON-encoded bodies
app.use(express.urlencoded({      // to support URL-encoded bodies
	extended: true
}));


app.use(function (req, res, next) {
	console.log("url called");
	console.log(req.protocol + "::/" + req.get('host') + req.originalUrl);
	next();
});
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use('/', express.static("public"));
app.use('/api/hook', require('./api/hook'));
app.use('/api/slackhook', require('./api/slackhook'));

app.listen(port, function (err) {
	if (err) throw err;
	console.log("Server is running on port " + port + ".");
});
