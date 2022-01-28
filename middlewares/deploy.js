const {readFileSync} = require('fs');

var Client = require('ssh2').Client;


function deployVRO(scriptName, callback) {
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
				stream.write('cd ../../data/vro3\n');
				stream.write(scriptName + '\n');
				stream.write('y\n');
				stream.write('y\n');
				stream.write('y\n');
				setTimeout(function () {
					stream.end('\nexit\n');
				}, 10000);
			});
		}).connect({
			host: config.ssh.host,
			port: 22,
			username: config.ssh.user,
			passphrase: config.ssh.pass,
			privateKey: readFileSync(config.ssh.keyfile)
		});
	}, 30000);
}

function deployVRI(scriptName, callback) {
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
				stream.write('cd ../../data/vri2k17\n');
				stream.write(scriptName + '\n');
				//stream.write('./deploy_wp.sh -p\n');
				stream.write('y\n');
				stream.write('y\n');
				stream.write('y\n');
				setTimeout(function () {
					stream.end('\nexit\n');
				}, 10000);
			});
		}).connect({
			host: config.ssh.host,
			port: 22,
			username: config.ssh.user,
			passphrase: config.ssh.pass,
			privateKey: readFileSync(config.ssh.keyfile)
		});
	}, 30000);
}


function deployAutomatedVRODev(callback) {
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
				stream.write('cd ../../data/vro3\n');
				stream.write('./automated_deploy_dev.sh -p\n');
				setTimeout(function () {
					stream.end('\nexit\n');
				}, 10000);
			});
		}).connect({
			host: config.ssh.host,
			port: 22,
			username: config.ssh.user,
			passphrase: config.ssh.pass,
			privateKey: readFileSync(config.ssh.keyfile)
		});
	}, 30000);
}

module.exports = {
	deployVRO: function (scriptName, callback) {
		deployVRO(scriptName, callback);
	},
	deployVRI: function (scriptName, callback) {
		deployVRI(scriptName, callback);
	},
	deployAutomatedVRODev: function (callback) {
		deployAutomatedVRODev(callback);
	}
}
