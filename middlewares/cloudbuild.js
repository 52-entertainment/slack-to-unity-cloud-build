var axios = require('axios');


async function deleteCall(url, cb) {
	await axios({
		method: "delete",
		url: url,
		headers: {
			Authorization: "Basic " + config.unity.apiKey,
			"Content-Type": "application/json"
		}
	}).then(response => {

		cb(null, response.data);

	}).catch(err => {
		console.log(err);
		cb(err);
	});
}

async function httpGet(url, cb) {
	await axios({
		method: "get",
		url: url,
		headers: {
			Authorization: "Basic " + config.unity.apiKey,
			"Content-Type": "application/json"
		}
	}).then(response => {

		cb(null, response.data);

	}).catch(err => {
		console.log(err);
		cb(err);
	});
}

async function httpPut(url, data, cb) {
	await axios({
		method: "put",
		url: url,
		headers: {
			Authorization: "Basic " + config.unity.apiKey,
			"Content-Type": "application/json"
		},
		data: data
	}).then(response => {

		cb(null, response.data);

	}).catch(err => {
		console.log(err);
		cb(err);
	});
}

async function httpPost(url, cb) {
	await axios({
		method: "post",
		url: url,
		headers: {
			Authorization: "Basic " + config.unity.apiKey,
			"Content-Type": "application/json"
		}
	}).then(response => {

		cb(null, response.data);

	}).catch(err => {
		console.log(err);
		cb(err);
	});
}


function getTarget(projectname, targetName) {
	var result = "";
	if (projectname == "vro" && targetName == "dev")
		result = "vro2k16-webgl-gs-beta-2-dev";
	if (projectname == "vro" && targetName == "prod")
		result = "vro2k16-webgl-gs-beta-2";
	if (projectname == "vri" && targetName == "dev")
		result = "webgl-dev";
	if (projectname == "vri" && targetName == "prod")
		result = "webgl";

	return result
}

function getProjectId(projectName) {
	var result = "";
	switch (projectName) {
		case "vri":
			result = "virtual-regatta-inshore";
			break;
		case "vro":
			result = "vro-2k16";
		default:

	}
	return result;
}


function build(projectname, branchName, target, callback) {
	const orgid = "regatta";
	const projectid = getProjectId(projectname);
	const buildtargetid = getTarget(projectname, target)
	var url = `${config.unity.baseUrl}/orgs/${orgid}/projects/${projectid}/buildtargets/${buildtargetid}`;
	httpGet(url, function (err, data) {
		if (err) return callback(err, "getBuildTarget" + url);
		data.settings.scm.branch = branchName;
		httpPut(url, data, function (err, _) {
			if (err) return callback(err, "updateBranchInBuildTarget" + url);
			var url = `${config.unity.baseUrl}/orgs/${orgid}/projects/${projectid}/buildtargets/${buildtargetid}/builds`;

			httpPost(url, function (err) {
				callback(err, "buildTarget" + url);
			})
		});
	});
}

function cancelAllBuild(projectname, callback) {
	getProjectId(projectname, function (err, projectid) {
		var orgid = "regatta";

		var url = config.unity.baseUrl +
			`/orgs/${orgid}/projects/${projectid}/buildtargets/_all/builds`;
		deleteCall(url, function (err, data) {
			callback(err, "buildTarget" + url);
		})
	})
}

module.exports = {
	build: function (projectname, branchName, target, callback) {
		build(projectname, branchName, target, callback);
	},
	cancelAllBuild: function (projectname, callback) {
		cancelAllBuild(projectname, callback);
	},
}
