module.exports = {
  'Check the Address text bar exists' : function (browser) {
    browser
      .url('https://mfocella.github.io/www/index.html')
      .waitForElementVisible('body', 1000)
      .setValue('input[id="contract_address"]', '0x9477c6902ed7016cbb8cc4076fbd7800c0914430')
      .waitForElementVisible('input[id="contract_address"]', 1000)
  },

  'Check the Address text bar contains correct text' : function (browser) {
    browser.pause(1000)
    browser.expect.element('#contract_address').to.have.value.which.equals('0x9477c6902ed7016cbb8cc4076fbd7800c0914430');
  },

  'Check Contract Details page is visible when tab clicked' : function (browser) {
    browser.useXpath().click("//*[contains(text(),'Contract Details')]");
    browser.useCss().expect.element('#Parties_h5').to.be.visible.before(100);
  },

  'Check Update Contract page is visible when tab clicked' : function (browser) {
    browser.useXpath().click("//*[contains(text(),'Update Contract')]");
    browser.useCss().expect.element('#update_on_click').to.be.visible.before(100);
  },

  'Check Upload Document page is visible when tab clicked' : function (browser) {
    browser.useXpath().click("//*[contains(text(),'Upload Document')]");
    browser.useCss().expect.element('#file_comment').to.have.text.which.equals("").before(400);
  },

  'Check About page is visible when tab clicked' : function (browser) {
    browser.useXpath().click("//*[contains(text(),'About')]");
    browser.useCss().expect.element('#about').to.be.visible.before(100);
    browser.end()
  },




 
};