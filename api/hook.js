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

function getStatusEmoji(status){
	switch (status){
		case 'queued':
			return '⏳';
		case 'started':
			return '🚀';
		case 'failed':
			return '❌';
		case 'success':
			return '👍';
		default:
			return '';
	}
}


router.get('/', function (req, res, next) {


	return res.status(200).send({result: true, errorMessage: null, data: {"elements": 0}});

})
router.post('/', function (req, res, next) {
	if (req.headers.authorization !== `Token ${config.unity.secret}`) {
		console.log("Invalid token")
		return res.status(403).send("Invalid token");
	}
	const buildNumber = req.body.buildNumber
	const buildStatus = req.body.buildStatus;
	const buildTargetName = req.body.buildTargetName;
	if (!config.targets.hasOwnProperty(buildTargetName)) {
		slack.sendMessageToSlack(`Unknown build target: ${buildTargetName}`, function (err, result) {
			if (err) console.log("slack error : " + err);
			if (result) console.log("slack message : " + result);
		});
		return res.status(500).send(`Unknown build target: ${buildTargetName}`);
	}
	
	const target = config.targets[buildTargetName];
	
	if (buildStatus === 'success'){
		deploy.runScript(target.deploy, ()=>{
			const result = target.urlTemplate
				.replaceAll('{date}', formatDate)
				.replaceAll('{buildNumber}', buildNumber)
			slack.sendMessageToSlack(result, function (err, result) {
				if (err) console.log("slack error : " + err);
				if (result) console.log("slack message : " + result);
			});
		});
	}

	const message = `Build *${target.shortname} ${buildNumber}*\nStatus: \`${buildStatus}${getStatusEmoji(buildStatus)}\`\nTarget: \`${buildTargetName}\``;

	slack.sendMessageToSlack(message, function (err, result) {
		if (err) console.log("slack error : " + err);
		if (result) console.log("slack message : " + result);
		return res.status(200).send({result: true, errorMessage: null, data: {"elements": 0}});
	});


})


module.exports = router;
