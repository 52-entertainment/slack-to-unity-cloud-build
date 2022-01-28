const {readFileSync} = require('fs');
const Client = require('ssh2').Client;


function runScript(commands, callback) {
	//We need to wait because unity cloud is not fully updated immediately.
	//will add a delay of 10 seconds
	setTimeout(function () {
		var conn = new Client();
		conn.on('ready', function () {
			console.log('Client :: ready');
			conn.shell(function (err, stream) {
				if (err) throw err;
				stream.on('close', function () {
					console.log('Stream :: close');
					conn.end();
					callback();
				}).on('data', function (data) {
					console.log('OUTPUT: ' + data);
				});
				for (const command of commands) {
					stream.write(`${command}\n`);
				}
				setTimeout(function () {
					stream.end('\nexit\n');
				}, 10000);
			});
		}).connect({
			host: process.env.SSH_HOST,
			port: 22,
			username: process.env.SSH_USER,
			passphrase: process.env.SSH_PASS,
			privateKey: readFileSync(process.env.SSH_KEYFILE)
		});
	}, 30000);
}

module.exports = {
	runScript: runScript
}
