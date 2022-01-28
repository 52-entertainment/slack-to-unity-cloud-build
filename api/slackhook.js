var router = require('express').Router();
var slack = require('../middlewares/slack');
var build = require('../middlewares/build');
var cancel = require('../middlewares/cancel');

router.post('/', function (req, res, next) {
	console.log("slack hook called");

	if (req.body.type == "url_verification") {
		slack.signVerification(req, res, next);
	} else {
		console.log(req.body)
		if (req.body.type == "event_callback") {
			if (req.body.token !== config.slack.verification) {
				return res.status(403).send("Invalid token");
			}
			if (req.body.hasOwnProperty("event")) {
				console.log("Got event");
				if (req.body.event.text == "Un café ?") {
					console.log(req.body.event.text);
					var msgToSend = "Et un café un ! ";
					slack.sendMessageToSlack(msgToSend, function (err, result) {
						console.log("slack error : " + err);
						console.log("slack message : " + result);
					});
					return res.status(200).send("☕️");
				}
				if (req.body.event.text.toLowerCase().startsWith("buildme")) {
					console.log(req.body.event.text);
					build.build(req.body.event.text, function (err) {
						if (err) console.log("buildme error : " + err);
					});
					return res.status(200).send("Build started");
				}

				if (req.body.event.text.toLowerCase().startsWith("buildcancel")) {
					console.log('buildCancel:' + req.body.event.text);
					cancel.cancel(req.body.event.text, function (err) {
						if (err) {
							console.log("buildCancel error : " + err);
							return res.status(500).send("Unable to cancel build");
						} else {
							return res.status(200).send("Build canceled");
						}
					});
				}
				return res.status(400).send("Unknown command");
			}
		}
	}


}, function (req, res) {
	console.log("answering");

	return res.status(200).send(req.body.challenge);

});


module.exports = router;
