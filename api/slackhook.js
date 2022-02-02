const router = require('express').Router();
const slack = require('../middlewares/slack');
const build = require('../middlewares/build');
const cancel = require('../middlewares/cancel');

const commandRgx = /^(?<command>\S+)(?<parameters> (?<project>\S+)(?<ref> (?<gitref>\S+) (?<target>\S+))?)?$/g;

router.post('/', function (req, res, next) {
	console.log("slack hook called");
	switch (req.body.type) {
		case "url_verification":
			console.log("URL verification requested")
			slack.signVerification(req, res, next);
			break;
		case "event_callback":
			if (req.body.token !== config.slack.verification) {
				return res.status(403).send("Invalid token");
			}
			if (req.body.hasOwnProperty('event')) {
				let match = commandRgx.exec(req.body.event.text);
				if (match === null) {
					return res.status(400).send("Could not find command");
				}
				switch (match.groups.command){
					case 'help':
						const msgToSend = `${build.help()}\n${cancel.help()}`
						slack.sendMessageToSlack(msgToSend, function (err, result) {
							console.log("slack error : " + err);
							console.log("slack message : " + result);
						});
						return res.status(200).send("Got help");
					case 'buildme':
						build.build(match.groups.command, match.groups.project, match.groups.gitref, match.groups.target, function (err) {
							if (err) console.log("buildme error : " + err);
						});
						return res.status(200).send("Build started");
					case 'buildcancel':
						cancel.cancel(match.groups.command, match.groups.project, function (err) {
							if (err) {
								console.log("buildCancel error : " + err);
								return res.status(500).send("Unable to cancel build");
							} else {
								return res.status(200).send("Build canceled");
							}
						});
					default:
						return res.status(400).send("Unknown command");
				}
			}
			break;
	}


}, function (req, res) {
	console.log("answering");

	return res.status(200).send(req.body.challenge);

});


module.exports = router;
