const DOMSelector = require('../domselector');

const enterEmail = async (page, email) =>{
    await DOMSelector.enterTextInInput(page, "email", email);
};

const enterPassword = async (page, password) => {
      await DOMSelector.enterTextInInput(page, "password", password);
};

const loginGoogle = async(page, email, password, progress = null) => {
    progress.progressInit(3);
    progress.progressUpdate();
    await enterEmail(page, email);
    progress.progressUpdate();
    await enterPassword(page, password);
    progress.progressUpdate();
};

exports.enterEmail = enterEmail;
exports.enterPassword = enterPassword;
exports.loginGoogle = loginGoogle;