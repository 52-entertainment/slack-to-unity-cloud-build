const router = require('express').Router();
const slack = require('../middlewares/slack');
const build = require('../middlewares/build');
const cancel = require('../middlewares/cancel');

const commandRgx = /^(?<command>\S+)(?<parameters> (?<project>\S+)(?<ref> (?<gitref>\S+) (?<target>\S+))?)?$/g;

router.post('/', function (req, res, next) {
	console.log("slack hook called");
	switch (req.body.type) {
		case "url_verification":
			console.log(`URL Verification.\nBody:\n${req.body}`);
			slack.signVerification(req, res, next);
			break;
		case "event_callback":
			if (req.body.token !== config.slack.verification) {
				console.log(`Bad token.\nBody:\n${req.body}`);
				return res.status(200).send("Invalid token");
			}
			if (!req.body.hasOwnProperty('event')) {
				console.log("No event data");
				return res.status(200).send();
			} else {
				let match = commandRgx.exec(req.body.event.text);
				if (match === null) {
					console.log(`No command match.\nText: ${req.body.event.text}`);
					return res.status(200).send("Could not find command");
				}
				switch (match.groups.command) {
					case 'help':
						console.log(`Help command.\nText: ${req.body.event.text}`);
						const msgToSend = `${build.help()}\n${cancel.help()}`
						slack.sendMessageToSlack(msgToSend, function (err, result) {
							console.log("slack error : " + err);
							console.log("slack message : " + result);
						});
						return res.status(200).send("Got help");
					case 'buildme':
						console.log(`Build command.\nText: ${req.body.event.text}`);
						build.build(match.groups.command, match.groups.project, match.groups.gitref, match.groups.target, function (err) {
							if (err) console.log("buildme error : " + err);
						});
						return res.status(200).send("Build started");
					case 'buildcancel':
						console.log(`Cancel command.\nText: ${req.body.event.text}`);
						cancel.cancel(match.groups.command, match.groups.project, function (err) {
							if (err) {
								console.log("buildCancel error : " + err);
								return res.status(200).send("Unable to cancel build");
							} else {
								return res.status(200).send("Build canceled");
							}
						});
						break;
					default:
						console.log(`Unknown command.\nText: ${req.body.event.text}`);
						return res.status(200).send("Unknown command");
				}
			}
		default:
			console.log(`Unknown body type.\nBody:\n${req.body}`);
			return res.status(200).send();
	}


}, function (req, res) {
	console.log("answering");

	return res.status(200).send(req.body.challenge);

});


module.exports = router;
