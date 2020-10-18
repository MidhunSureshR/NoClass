const UI = require('./ui');
const browser = require('./browser');
const credentials = require('./credentials');
const GoogleAccount = require('./google/account');
const MeetAPI = require('./google/meet');
const progress = require('./progress');

const entry = () => {
    UI.showTitle();
    (async () => {
      try{
        let bar;
        const page1 = await browser.initBrowser();
 
        const p = progress.bindProgress(
          steps => {
            bar = UI.createBar(steps*100, "Google Login");
          }, () => bar.increment(100));
        await GoogleAccount.loginGoogle(page1, credentials.email, credentials.password, p);
        
        let bar2 = UI.createBar(400, "Enter Google Meet");
        const page = await MeetAPI.automateMeet("https://meet.google.com/cce-htcb-tew", bar2);
        bar2.stop();
        console.log("Setup Completed " +  "✅".green);
        console.log("Hooked to Chat Messages " +  "✅".green);
        console.log("\nAnalyzing chat messages".bgWhite.black);
        while(true){
          await MeetAPI.scanForMessages(page, () => console.log("Attendance Detected " +  "✅".green) );
          await page.waitForTimeout(2000); 
        }
      }
      catch(e){
        console.log(e);
      }
    })();
};

entry();