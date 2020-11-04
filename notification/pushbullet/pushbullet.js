const axios = require('axios');
const fs = require('fs');
const yaml = require('yaml');

let pushbulletConfig;
const readConfig = () => {
  const file = fs.readFileSync('./notification/pushbullet/config.yaml', 'utf8');
  pushbulletConfig = yaml.parse(file);
};

const getPushBulletData = (title, description) => {
    const data = {
        "active": true,
        "body": description,
        "direction": "incoming",
        "dismissed": false,
        "title": title,
        "type": "note"
      };
      return data;
};

const sendNotification = (formLink = null) => {
    readConfig();
    const message = `Time for attendance bwoies!!\n${formLink?"Form link : " + formLink: ""}`;
    const data = getPushBulletData("AttendanceBot", message);
    const send = access_token => {
        const config = {
            headers :
            {
            'Content-Type': 'application/json',
            'Access-Token': access_token
            }
        };
        axios.post(pushbulletConfig.api_url, data, config)
            .catch(error => console.log(error));
  };
  pushbulletConfig.access_tokens.forEach(token => send(token));
};

exports.sendNotification = sendNotification;