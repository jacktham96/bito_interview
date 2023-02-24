const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function move_to_bottom(driver) {
  await driver.sleep(1000);
  await driver.executeScript("var q=document.documentElement.scrollTop=10000");
}

class Setup {
  constructor() {
    this.search_key = 'BitoPro';
    this.web_url = 'https://www.google.com/';
    this.search_title_list = [];
    this.search_title_url_list = [];
    this.verify_title_str = 'BitoPro 台灣幣託交易所';
    this.verify_url_str = 'https://www.bitopro.com';
    this.driver = new Builder().forBrowser('chrome').build();
    this.driver.manage().setTimeouts({ pageLoad: 15000 });
  }

  async test_google_search_results() {
    await this.driver.get(this.web_url);
    const get_search_result = await this.driver.wait(until.elementLocated(By.name('q')), 5000,);
    await get_search_result.sendKeys(this.search_key, Key.RETURN);
    
    await move_to_bottom(this.driver);

  }

  async quit() {
    await this.driver.quit();
  }
}

const test = new Setup();
test.test_google_search_results()
  .then(() => test.quit());