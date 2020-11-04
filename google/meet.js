const UI = require('../ui');
const DOMSelector = require('../domselector');
const discord = require('../notification/discord/discord');
const pushbullet = require('../notification/pushbullet/pushbullet');

const automateMeet = async (meetLink, progress) => {
    progress.progressInit(4);
    // We do not want camera or microphone by default
    const browser = require('../browser');
    await browser.disablePermissions("https://meet.google.com");
    UI.set_bar(bar, 100);
    progress.progressUpdate();

    const page = await browser.openNewPage();
    await page.goto(meetLink);
    UI.set_bar(bar, 200);
    progress.progressUpdate();

    // Close message that indicates the lack of permission
    await closePermissionPrompt(page);
    UI.set_bar(bar, 300);
    progress.progressUpdate();

    // Join meet
    await enterMeeting(page);
    UI.set_bar(bar, 400);
    UI.stop_bar(bar);
    progress.progressUpdate();
    return page;
};

const enterMeeting = async page => {
    const path = await DOMSelector.getXPathFromText("span", "Join now");
    await page.waitForXPath(path, { visible: true });
    const [joinBtn] = await DOMSelector.getNodeFromText(page, "span", "Join now");
    await joinBtn.click();
};

const closePermissionPrompt = async page => {
    const body = await page.$('body');
    await body.press('Escape');
};

const activateChat = async page => {
    const btn = await page.$('div[aria-label="Chat with everyone"][aria-expanded="false"]');
    if (btn != null) {
        btn.click();
    }
};

const getMessageProperties = async node => {

    return await node.evaluate(n => {
        const parentNode = n.parentNode;
        const siblingNode = parentNode.previousSibling;
        const detailsNode = siblingNode.childNodes;
        const name = detailsNode[0].innerText;
        const time = detailsNode[1].innerText;
        const message = n.innerText;
        return [name, time, message];
    });

};

let lastLength = 0;
const scanForMessages = async (page, onDetection) => {
    activateChat(page);
    const items = await page.$$('div[data-message-text]');
    for (let i = lastLength; i < items.length; ++i) {
        const node = items[i];
        const [name, time, message] = await getMessageProperties(node);
        console.log(`${name}`.red + ` <${time}> `.blue + `: ${message}`);
        if (analyzeMessage(message)) onDetection();
    }
    lastLength = items.length;
};

let detectionCount = 0;
const threshold = 1;
let stop = false;

const analyzeMessage = message => {
    // Special case when the teacher takes attendance through google form
    const formDetected = message.search("forms.gle") !== -1;

    if (stop) return;
    detectionCount = message.search(/present/i) === -1 ? detectionCount : detectionCount + 1;
    if (formDetected || detectionCount >= threshold) {
        discord.sendNotification(formDetected? message : null);
        pushbullet.sendNotification(formDetected? message : null);
        stop = true;
        return true;
    }
};

exports.automateMeet = automateMeet;
exports.scanForMessages = scanForMessages;