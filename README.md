# Cloud Build Tool
## Unity Cloud Build 🤝 Slack

A tool that helps run Unity Cloud Build via Slack commands

## Usage

### Configure
Create a `.env` file with the following info:
```dotenv
secretKey="Secret key for session management"
slackToken="xoxb-SlackToken"
slackSigningSecret="d3adb33fSlackSecret"
UnityVROCloudBuildApiKey="c0ffeeb01UnityCloudBuildKey"
baseUrl="https://build-api.cloud.unity3d.com/api/v1"
SSH_HOST="my.sshserver.com"
SSH_USER="username"
SSH_PASS="p4ssw0rd"
SSH_KEYFILE="path/to/ssh.key"
```

### Install and run
1. Install: `npm install`
2. Run: `npm start`