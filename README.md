# NoClass

A google-meet bot written in node-js to send discord & pushbullet notifications when it's time for attendance.

## Does this work out of the box?

Not unless we go to the same college.

## How do I run the bot

1. Add your google account details to credentials-test.js file and rename the file to credentials.js.
2. Create a config.yaml file in notification/discord folder with the following fields:

```yaml
webhook_url: "INSERT_DISCORD_WEBHOOK_URL"
discord:
  embed_color: 16056575
  username: "INSERT_BOT_USERNAME"
  avatar_url: "INSERT_BOT_AVATAR_URL"
```

3. Create a config.yaml file in notification/pushbullet folder with the following fields:

```yaml
api_url: "https://api.pushbullet.com/v2/pushes"
access_token: "INSERT_API_ACCESS_TOKEN"
```

_Example templates for (2) and (3) are available in their respective directories._

4. Install the dependenies by running the follow command in the root directory of the project.

```properties
npm install
```

5. Run the bot with:

```properties
npm start
```
