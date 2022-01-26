var slack = require('./slack');

function build(order, callback) {
	var params = order.split(' ');
	if (params.length == 1) {
		unknownMessage(function (err) {
			callback(err);
			
		});
	} else if (params.length == 2) {
		if (params[1] == "?") {
			helpMessage(function (err) {
				callback(err);
				
			});
		} else {
			unknownMessage(function (err) {
				callback(err);
				
			});
		}

	} else if (params.length == 4) {

		var cloudbuild = require('./cloudbuild');
		var projectname = params[1];
		var branchName = params[2];
		var target = params[3];
		cloudbuild.build(projectname, branchName, target, function (err, data) {
			if (err) {
				var msgToSend = "CloudBuilder erreur : \n" + err + "\n" + data;
				slack.sendMessageToSlack(msgToSend, function (err, result) {
					callback(err);
					
				});
			} else {
				var msgToSend = "CloudBuilder launched on branch + " + branchName + " for " + target;
				slack.sendMessageToSlack(msgToSend, function (err, result) {

					callback(err);
					
				});
			}

		})
	} else {
		unknownMessage(function (err) {
			callback(err);
			
		});
	}

}

function helpMessage(callback) {
	var msgToSend = "CloudBuilder automated launcher";
	msgToSend += "\nusage : buildme <vri/vro> <git branch> <dev/prod>"
	slack.sendMessageToSlack(msgToSend, function (err, result) {

		callback(err);
	});
}

function unknownMessage(callback) {
	var msgToSend = "commande build inconnue";
	slack.sendMessageToSlack(msgToSend, function (err, result) {

		callback(err);
	});
}


module.exports = {
	build: function (order, callback) {
		build(order, callback);
	}
}
