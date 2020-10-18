const axios = require('axios');
const fs = require('fs');
const yaml = require('yaml');

let pushbulletConfig;
const readConfig = () => {
  const file = fs.readFileSync('./notification/pushbullet/config.yaml', 'utf8');
  pushbulletConfig = yaml.parse(file);
  console.log(`API_URL = ${pushbulletConfig.api_url}
               ACCESS_TOKEN = ${pushbulletConfig.access_token}`
            );
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

const sendNotification = () => {
    readConfig();
    const data = getPushBulletData("AttendanceBot", "Looks like it's time for attendance!!");
    const config = {
        headers :
        {
        'Content-Type': 'application/json',
        'Access-Token': pushbulletConfig.access_token
        }
    };
    axios.post(pushbulletConfig.api_url, data, config)
         .catch(error => console.log(error));
};

exports.sendNotification = sendNotification;