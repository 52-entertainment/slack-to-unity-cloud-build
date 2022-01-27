# Cloud Build Tool
## Unity Cloud Build 🤝 Slack

A tool that helps run Unity Cloud Build via Slack commands

## Running the tool

### Requirements

Have [Docker](https://www.docker.com/) installed

### Configure
Create a `.env` file with the following info:
```dotenv
secretKey="Secret key for session management"
slackToken="xoxb-SlackToken"
slackChannel="#my-build-channel"
slackSigningSecret="d3adb33fSlackSecret"
UnityVROCloudBuildApiKey="c0ffeeb01UnityCloudBuildKey"
baseUrl="https://build-api.cloud.unity3d.com/api/v1"
SSH_HOST="my.sshserver.com"
SSH_USER="username"
SSH_PASS="p4ssw0rd"
SSH_KEYFILE="path/to/ssh.key"
```

### Build and run
Build a Docker image: `docker build . -t cloudbuild`   
Run it: `docker run -p 4000:4000 -d cloudbuild`