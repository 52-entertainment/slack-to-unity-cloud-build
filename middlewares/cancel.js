var slack = require('./slack');
var cloudBuild = require('./cloudbuild');


function cancel(order, callback) {
	var params = order.split(' ');
	if (params.length == 2) {

		if (params[1] == "?") {
			helpMessage(function (err) {
				callback(err);
				
			});
		} else {
			var cloudbuild = require('./cloudbuild');
			var projectname = params[1];
			cloudBuild.cancelAllBuild(projectname, function (err, data) {
				if (err) {
					var msgToSend = "CloudBuilder buildcancel en erreur : \n" + err + "\n" + data;
					slack.sendMessageToSlack(msgToSend, function (err, result) {
						callback(err);
						
					});
				} else {
					var msgToSend = "CloudBuilder annulation réalisée sur le projet " + projectname + " pour tous les cibles";
					slack.sendMessageToSlack(msgToSend, function (err, result) {

						callback(err);
						
					});
				}

			});

		}
	} else {
		unknownMessage(function (err) {
			callback(err);
			
		});
	}
}


function helpMessage(callback) {
	var msgToSend = "CloudBuilder buildcancel will cancell all currently build for a target";
	msgToSend += "\nusage : buildcancel <vri/vro>"
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
	cancel: function (order, callback) {
		cancel(order, callback);
	}
}
