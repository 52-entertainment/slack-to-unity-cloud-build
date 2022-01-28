var axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const {hasUncaughtExceptionCaptureCallback} = require('process');
// fetch this from environment variables
const slackSigningSecret = config.slack.signingSecret;


function sendMessageToSlack(message, callback) {
	axios({
		method: "post",
		url: "https://slack.com/api/chat.postMessage",
		data: {
			channel: config.slack.channel,
			text: message
		},
		headers: {
			Authorization: "Bearer " + config.slack.token
		}
	}).then(response => {
		callback(null);
	}).catch(err => {
		callback(err);
	});
}

function signVerification(req, res, next) {
	let slackSignature = req.headers['x-slack-signature'];
	let requestBody = JSON.stringify(req.body);
	//let requestBody = qs.stringify(req.body, {format : 'RFC1738'});
	console.log(requestBody);
	let timestamp = req.headers['x-slack-request-timestamp'];
	let time = Math.floor(new Date().getTime() / 1000);
	if (Math.abs(time - timestamp) > 300) {
		return res.status(400).send('Ignore this request.');
	}
	if (!slackSigningSecret) {
		return res.status(400).send('Slack signing secret is empty.');
	}
	let sigBasestring = 'v0:' + timestamp + ':' + requestBody;
	let mySignature = 'v0=' +
		crypto.createHmac('sha256', slackSigningSecret)
			.update(sigBasestring, 'utf8')
			.digest('hex');
	console.log("mySignature");
	console.log(mySignature);
	if (crypto.timingSafeEqual(
		Buffer.from(mySignature, 'utf8'),
		Buffer.from(slackSignature, 'utf8'))
	) {
		console.log("good bot");
		return next();
	} else {
		console.log("bad bot");
		return res.status(400).send('Verification failed');
	}
}


module.exports = {
	sendMessageToSlack: function (branchName, callbback) {
		sendMessageToSlack(branchName, callbback);
	},
	signVerification: function (req, res, next) {
		signVerification(req, res, next);
	},
}
