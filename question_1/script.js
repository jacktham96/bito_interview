const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs')

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


  async verify_search_result(){
    const resultTitle = await this.driver.wait(until.elementsLocated(By.css('div a h3')), 5000)
    
    for (const title of resultTitle) {
      const searchTitle = await title.getText();
      const searchTitleUrl = await title.findElement(By.xpath('..')).getAttribute('href');
    
      this.search_title_list.push(searchTitle);
      this.search_title_url_list.push(searchTitleUrl);
      

      // Check if actual result matches expected result
      if (searchTitle.includes(this.verify_title_str) && searchTitleUrl.includes(this.verify_url_str)) {
        console.log(`Its a match: ${searchTitle} - ${searchTitleUrl}`);  
        return {title: searchTitle , url: searchTitleUrl}
      }

    console.log('No Match');
    return false;
  }
  }


  async test_google_search_results() {
    await this.driver.get(this.web_url);
    const get_search_result = await this.driver.wait(until.elementLocated(By.name('q')), 5000,);
    await get_search_result.sendKeys(this.search_key, Key.RETURN);
    
    await move_to_bottom(this.driver);

    const result = await this.verify_search_result();
    assert.ok(result, `Failed to find search result for "${this.verify_title_str}" at "${this.verify_url_str}". Search results: ${JSON.stringify(this.search_title_list)}`);
    
  }

  async quit() {
    await this.driver.quit();
  }
}

const test = new Setup();
test.test_google_search_results()
  .then(() => test.quit());