const slack = require('./slack');
const cloudBuild = require('./cloudbuild');

const baseUsage = "`buildcancel <project>`";
function getUsageString(){
	if (!config.hasOwnProperty('projects')) {
		return `Usage: ${baseUsage}\n*⚠️ Warning: no valid projects found in \`config.yaml\`*`;
	}
	const projects = Object.keys(config.projects);
	if (projects.length===0){
		return `Usage: ${baseUsage}\n*⚠️ Warning: no valid projects found in \`config.yaml\`*`;
	}
	return `Usage: ${baseUsage}\n_e.g_: \`buildcancel ${projects[0]}\``
}

const help = ()=>`Use \`buildcancel\` to cancel builds:\n${getUsageString().split('\n').map(s=>`\t${s}`).join('\n')}`

function cancel(order, callback) {
	const params = order.split(' ');
	if (params.length === 2) {

		if (params[1] === "?") {
			helpMessage(function (err) {
				callback(err);
				
			});
		} else {
			const projectName = params[1];
			cloudBuild.cancelAllBuild(projectName, function (err, data) {
				if (err) {
					const msgToSend = `🛑 *Failed while trying to cancel builds* 🛑\n${err}\n${data}`;
					slack.sendMessageToSlack(msgToSend, function (err) {
						callback(err)
					});
				} else {
					const msgToSend = `Builds canceled for project \`${projectName}\``;
					slack.sendMessageToSlack(msgToSend, function (err) {
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
	const msgToSend = `Cancel ongoing builds\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err, result) {

		callback(err);
	});
}

function unknownMessage(callback) {
	const msgToSend = `Invalid command\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err, result) {
		callback(err);
	});
}


module.exports = {
	cancel: cancel,
	help: help
}
