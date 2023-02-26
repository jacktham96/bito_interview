const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const {google} = require('googleapis');

const SPREADSHEET_ID = '14X8ocEdHrNK2nGH5JY3aP7GbK_v0Wzn-pRycawhNR18';
const SHEET_NAME = 'Sheet1!A:E';

async function move_to_bottom(driver) {
  await driver.sleep(1000);
  await driver.executeScript("var q=document.documentElement.scrollTop=10000");
}

async function sendToGoogleSheet (spreadsheetId, sheetName, data) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const client = await auth.getClient();
    google.options({auth:client})

    //Write data to sheet
    const response = await google.sheets('v4').spreadsheets.values.append({
      spreadsheetId , 
      range : sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data,
      },
    });

    console.log(`${response.data.updates.updatedCells} cells appended to ${sheetName}.`);

  }

  catch (err) {
    console.error(err)
  }
}



class Setup {
  constructor() {
    this.web_url = 'https://www.bitopro.com/ns/fees';
    this.driver = new Builder().forBrowser('chrome').build();
    this.driver.manage().setTimeouts({ pageLoad: 15000 });
  }

  async crwalData() {
    const table = await this.driver.findElement(By.xpath('//*[@id="__next"]/div[1]/div[1]/div/div/div[2]/div[1]/div[2]/table')) 
    
    // Get the table header data
    const headers = await table.findElements(By.css('thead tr th'));
    const headerText = [];
    for (let i = 0; i < headers.length; i++) {
      headerText.push(await headers[i].getText());
    }
  
    // Get the table rows and column data
    const rows = await table.findElements(By.css('tbody tr'))
    const data = []
    
    for (let i=1 ; i < rows.length ; i++) {
      const row = rows[i];
      const col = await row.findElements(By.css('td'));
      const rowData= [];
  
      for (let j=0 ; j < col.length; j++) {
        rowData.push(await col[j].getText());
      }
  
      data.push(rowData)
  
    }
    return(data)
  }

  async test_scrapdata() {
    await this.driver.get(this.web_url);
    await move_to_bottom(this.driver);

    const getData = await this.crwalData()


    console.log(getData);

    const data = [
      ['John', 'Doe', 'john.doe@example.com', '555-1234'],
      ['Jane', 'Doe', 'jane.doe@example.com', '555-5678'],
    ];

    await sendToGoogleSheet(SPREADSHEET_ID, SHEET_NAME, getData)
    await this.driver.quit();
  }

}


const test = new Setup();
test.test_scrapdata();