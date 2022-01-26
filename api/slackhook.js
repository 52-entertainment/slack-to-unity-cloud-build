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
		res.status(200).send();
		if (req.body.type == "event_callback") {
			if (req.body.hasOwnProperty("event")) {
				console.log("Got event");
				if (req.body.event.text == "Un café ?") {
					console.log(req.body.event.text);
					var msgToSend = "Et un café un ! ";
					slack.sendMessageToSlack(msgToSend, function (err, result) {
						console.log("slack error : " + err);
						console.log("slack message : " + result);


					});
				}
				if (req.body.event.text.toLowerCase().startsWith("buildme")) {
					console.log(req.body.event.text);
					build.build(req.body.event.text, function (err) {
						if (err) console.log("buildme error : " + err);

					});
				}

				if (req.body.event.text.toLowerCase().startsWith("buildcancel")) {
					console.log('buildCancel:' + req.body.event.text);
					cancel.cancel(req.body.event.text, function (err) {
						if (err) console.log("buildCancel error : " + err);

					});
				}

			}
		}
	}


}, function (req, res) {
	console.log("answering");

	return res.status(200).send(req.body.challenge);

});


module.exports = router;
