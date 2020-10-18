const getNodeFromText = async (page, tag, text) => await page.$x(await getXPathFromText(tag, text));

const getXPathFromText = async (tag, text) => `//${tag}[contains(., '${text}')]`;

const enterTextInInput = async (page, input_type, text) => {
    await page.waitForSelector(`input[type=${input_type}]`,{visible: true});
    await page.keyboard.type(text);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
};

exports.getNodeFromText = getNodeFromText;
exports.getXPathFromText = getXPathFromText;
exports.enterTextInInput = enterTextInInput;