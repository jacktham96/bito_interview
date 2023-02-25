const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs')

async function move_to_bottom(driver) {
  await driver.sleep(1000);
  await driver.executeScript("var q=document.documentElement.scrollTop=10000");
}

class Setup {
  constructor() {
    this.driver = new Builder().forBrowser('chrome').build();
    this.driver.manage().setTimeouts({ pageLoad: 15000 });
  }



}

const test = new Setup();
test.test_google_search_results()
  .then(() => test.quit());