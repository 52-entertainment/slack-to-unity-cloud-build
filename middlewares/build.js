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

function build(command, project, gitRef, target, callback) {
	if (project === '?'){
		helpMessage(function (err) {
			callback(err);
		});
	}
	if (project === null || project === undefined) {
		unknownMessage(`Missing project name parameter.`,function (err) {
			callback(err);
		});
		return
	}
	if (gitRef === null || gitRef === undefined) {
		unknownMessage(`Missing git reference parameter.`,function (err) {
			callback(err);
		});
		return
	}
	if (target === null || target === undefined) {
		unknownMessage(`Missing target parameter.`,function (err) {
			callback(err);
		});
		return
	}
	cloudbuild.build(project, gitRef, target, function (err, data) {
		if (err) {
			const msgToSend = `🛑 *Failed while requesting a build slot* 🛑\n${err}\n${data}`;
			slack.sendMessageToSlack(msgToSend, function (err) {
				callback(err);
			});
		} else {
			const msgToSend = `Requesting build for project *${project}* on branch \`${gitRef}\` for target: \`${target}\``;
			slack.sendMessageToSlack(msgToSend, function (err) {
				callback(err);
			});
		}
	})
}

function helpMessage(callback) {
	const msgToSend = `Cloud build automated launcher\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err) {
		callback(err);
	});
}

function unknownMessage(problem, callback) {
	const msgToSend = `Invalid command\n${problem}\n${getUsageString()}`
	slack.sendMessageToSlack(msgToSend, function (err) {
		callback(err);
	});
}

module.exports = {
	build: build,
	help: help
}
