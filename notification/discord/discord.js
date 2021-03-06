const axios = require('axios');
const yaml = require('yaml');
const fs = require('fs');

let discordConfig;

const readConfig = () => {
  const file = fs.readFileSync('./notification/discord/config.yaml', 'utf8');
  discordConfig = yaml.parse(file);
};


const getDiscordJSONData = (title, description) => {
  const data = {
    "embeds": [
      {
        "title": title,
        "description": description,
        "color": discordConfig.discord.embed_color
      }
    ],
    "username": discordConfig.discord.username,
    "avatar_url": discordConfig.discord.avatar_url
  };
  return data;
};


const sendNotification = (formLink = null) => {
  readConfig();
  const message = `Time for attendance bwoies!!\n${formLink?"Form link : " + formLink: ""}`;
  const data = getDiscordJSONData("Attendance Detected", message);
  axios.post(discordConfig.webhook_url, data)
    .catch(error => console.error(error));
};

exports.sendNotification = sendNotification;
exports.readConfig = readConfig;