var router = require('express').Router();
var slack = require('../middlewares/slack');
var deploy = require('../middlewares/deploy');

function formatDate() {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('');
}


router.get('/', function (req, res, next) {


	return res.status(200).send({result: true, errorMessage: null, data: {"elements": 0}});

})
router.post('/', function (req, res, next) {
	var buildNumber = req.body.buildNumber
	var buildStatus = req.body.buildStatus;
	var buildTargetName = req.body.buildTargetName;

	if (buildStatus == "success" && buildTargetName == "WebGL-dev") {
		deploy.deployVRI("./deploy_wp.sh", function (err) {
			var result = "https://www-dev.virtualregatta.com/fr/inshore-jeu?versionRelease=" + formatDate() + "-" + req.body.buildNumber;
			slack.sendMessageToSlack(result, function (err, result) {
				console.log("slack error : " + err);
				console.log("slack message : " + result);

				//return res.status(200).send({result: true,errorMessage : null, data : {"elements":0}});
			});
		});
	}
	if (buildStatus == "success" && buildTargetName == "WebGL") {
		deploy.deployVRI("./deploy_wp.sh -p", function (err) {
			var result = "https://www.virtualregatta.com/fr/inshore-jeu?versionRelease=" + formatDate() + "-" + req.body.buildNumber;
			slack.sendMessageToSlack(result, function (err, result) {
				console.log("slack error : " + err);
				console.log("slack message : " + result);

				//return res.status(200).send({result: true,errorMessage : null, data : {"elements":0}});
			});
		});
	}

	var message = "Build VRI " + req.body.buildNumber;
	message += " status " + req.body.buildStatus;
	message += " target " + req.body.buildTargetName;

	slack.sendMessageToSlack(message, function (err, message) {
		console.log(req.body);
		return res.status(200).send({result: true, errorMessage: null, data: {"elements": 0}});
	});


})


module.exports = router;
