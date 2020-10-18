const puppeteer = require('puppeteer-extra');
require('colors');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


puppeteer.use(StealthPlugin());
let browser = null;

const initBrowser = async () =>{
    const options = {headless:false};
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('https://accounts.google.com');
    return page;
};

const openNewPage = async () => await browser.newPage();;

const disablePermissions = async link =>{
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(link, ['background-sync']);
};

exports.initBrowser = initBrowser;
exports.disablePermissions = disablePermissions;
exports.openNewPage = openNewPage;