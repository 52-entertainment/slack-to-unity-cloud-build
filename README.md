# Cloud Build Tool
## Unity Cloud Build 🤝 Slack

A tool that helps run Unity Cloud Build via Slack commands

## Running the tool

### Requirements

Have [Docker](https://www.docker.com/) installed

### Configure
Create a `config.yaml` file with the following info (or copy `config.sample.yaml` as a template:
```yaml
key: some secret key
slack:
  token: xoxb-bot-token
  signingSecret: signing secret from slack
  channel: "#channel-to-post-to"
  verification: shared secret with slack
unity:
  org: MyUnityOrg
  baseUrl: https://build-api.cloud.unity3d.com/api/v1
  apiKey: api key from unity
  secret: shared secret with unity
ssh:
  host: your.deploymachine.com
  user: builduser
  pass: sshpassword
  keyfile: ssh.key
projects:
  CoolGame:
    id: cool-game
    targets:
      dev: cool-game-webgl-dev
      prod: cool-game-webgl
targets:
  "Cool Game WebGL Dev":
    shortname: Dev build
    urlTemplate: "https://your.website.com/game?version={date}-{buildNumber}-beta"
    deploy:
      - cd /to/deployscript
      - ./deploy.sh
  "Cool Game WebGL":
    shortname: Production
    urlTemplate: "https://your.website.com/game?version={date}-{buildNumber}"
    deploy:
      - cd /to/deployscript
      - ./deploy.sh --prod
```

### Build and run
Build a Docker image: `docker build . -t cloudbuild`   
Run it: `docker run -p 4000:4000 -d cloudbuild`