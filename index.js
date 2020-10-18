const UI = require('./ui');
const browser = require('./browser');
const Credentials = require('./credentials');
const GoogleAccount = require('./google/account');
const MeetAPI = require('./google/meet');
const Progress = require('./progress');

const performGoogleLogin = async () => {
    let bar;
    const page = await browser.initBrowser();
    const newBar = steps => {bar = UI.createBar(steps*100, "Google Login");};
    const p = Progress.bindProgress(newBar, () => bar.increment(100));
    await GoogleAccount.loginGoogle(page, Credentials.email, Credentials.password, p);
    await page.close();
};

const joinMeet = async meetCode => {
  let bar = UI.createBar(400, "Enter Google Meet");
  const page = await MeetAPI.automateMeet(`https://meet.google.com/${meetCode}`, bar);
  bar.stop();
  console.log("Setup Completed " +  "✅".green);
  return page;
};

const pollForAttendance = async page => {
  console.log("Hooked to Chat Messages " +  "✅".green);
  console.log("\nAnalyzing chat messages".bgWhite.black);
  while(true){
    const callback = () => console.log("Attendance Detected " +  "✅".green);
    await MeetAPI.scanForMessages(page, callback);
    await page.waitForTimeout(2000); 
  }
};

const entry = async () => {
  try{
    UI.showTitle();
    await performGoogleLogin();
    const meetCode = process.argv[2];
    joinMeet(meetCode).then(page => pollForAttendance(page));
  }
  catch(e){
    console.log(e);
  }
};

(async () => await entry())();