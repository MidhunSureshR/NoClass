const UI = require('../ui');
const DOMSelector = require('../domselector');
const discord = require('../notification/discord/discord');
const pushbullet = require('../notification/pushbullet/pushbullet');

const automateMeet = async (meetLink, bar) => {
    // We do not want camera or microphone by default
    const browser = require('../browser');
    await browser.disablePermissions("https://meet.google.com");
    UI.set_bar(bar, 100);

    const page = await browser.openNewPage();
    await page.goto(meetLink);
    UI.set_bar(bar, 200);

    // Close message that indicates the lack of permission
    await closePermissionPrompt(page);
    UI.set_bar(bar, 300);

    // Join meet
    await enterMeeting(page);
    UI.set_bar(bar, 400);
    UI.stop_bar(bar);
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
const threshold = 2;
let stop = false;

const analyzeMessage = message => {
    if (stop) return;
    detectionCount = message.search("present") === -1 ? detectionCount : detectionCount + 1;
    if (detectionCount >= threshold) {
        discord.sendNotification();
        pushbullet.sendNotification();
        stop = true;
        return true;
    }
};

exports.automateMeet = automateMeet;
exports.scanForMessages = scanForMessages;