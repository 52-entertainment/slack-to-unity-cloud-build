const slack = require('./slack');
const cloudbuild = require('./cloudbuild');
const baseUsage = "`buildme <project> <git-ref> <target>`";
function getUsageString(){
	if (!config.hasOwnProperty('projects')) {
		return `Usage: ${baseUsage}\n*⚠️ Warning: no valid projects found in \`config.yaml\`*`;
	}
	const projects = Object.keys(config.projects);
	if (projects.length===0){
		return `Usage: ${baseUsage}\n*⚠️ Warning: no valid projects found in \`config.yaml\`*`;
	}
	const project = config.projects[projects[0]];
	if (!project.hasOwnProperty('targets') || Object.keys(project.targets).length === 0){
		return `Usage: ${baseUsage}\n*⚠️ Warning: no valid projects found in \`config.yaml\`*`;
	}
	const target = Object.keys(project.targets)[0];
	return `Usage: ${baseUsage}\n_e.g_: \`buildme ${projects[0]} feature/more-lasers ${target}\``
}

const help = ()=>`Use \`buildme\` to launch builds:\n${getUsageString().split('\n').map(s=>`\t${s}`).join('\n')}`

function build(order, callback) {
	const params = order.split(' ');
	switch (params.length) {
		case 2:
			if (params[1] === "?") {
				helpMessage(function (err) {
					callback(err);
				});
			} else {
				unknownMessage(function (err) {
					callback(err);
				});
			}
			break;
		case 4:
			const projectName = params[1];
			const branchName = params[2];
			const target = params[3];
			cloudbuild.build(projectName, branchName, target, function (err, data) {
				if (err) {
					const msgToSend = `🛑 *Failed while requesting a build slot* 🛑\n${err}\n${data}`;
					slack.sendMessageToSlack(msgToSend, function (err) {
						callback(err);
					});
				} else {
					const msgToSend = `Requesting build for project *${projectName}* on branch \`${branchName}\` for target: \`${target}\``;
					slack.sendMessageToSlack(msgToSend, function (err) {
						callback(err);
					});
				}

			})
			break;
		default:
			unknownMessage(function (err) {
				callback(err);
			});
			break;
	}

}

function helpMessage(callback) {
	const msgToSend = `Cloud build automated launcher\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err) {
		callback(err);
	});
}

function unknownMessage(callback) {
	const msgToSend = `Invalid command\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err) {
		callback(err);
	});
}

module.exports = {
	build: build,
	help: help
}
