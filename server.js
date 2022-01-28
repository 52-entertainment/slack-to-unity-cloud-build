const yaml = require('yaml');
const {readFileSync} = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require('path');
const app = express();
global.config = yaml.parse(readFileSync('config.yaml', 'utf8'))

const port = config.port || process.env.port || 4000


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: config.key,
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}))

app.use(flash());


app.use(function (req, res, next) {
	res.locals.user = req.user;
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

app.use(function (req, res, next) {
	res.locals.user = req.user;
	next();
});


app.get('/*', function (req, res, next) {
	if (typeof req.cookies['connect.sid'] != 'undefined') {
		console.log(req.cookies['connect.sid']);
	}
	next();
});

app.listen(port, function (err) {
	if (err) throw err;
	console.log("Server is running on port " + port + ".");
});
