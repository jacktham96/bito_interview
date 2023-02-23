const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function googleSearchTest() {
  // create a new WebDriver instance
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // navigate to Google
    await driver.get('https://www.google.com/');

    // find the search box and enter a keyword
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('pornhub', Key.RETURN);

    // wait for the search results to load
    await driver.wait(until.titleContains('selenium webdriver'), 5000);

    // assert that the search results contain the keyword
    const resultStats = await driver.findElement(By.id('result-stats'));
    const resultStatsText = await resultStats.getText();
    assert.ok(resultStatsText.includes('About'), 'Search results do not contain the keyword');

    console.log('Test passed successfully');
  } catch (error) {
    console.error('Test failed: ', error);
  } finally {
    // close the browser
    await driver.quit();
  }
}

googleSearchTest();
