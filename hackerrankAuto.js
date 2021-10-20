// node hackerrankAuto.js --url=https://www.hackerrank.com/ --config=config.json --codeFile=codeSolution.txt

let minimist = require('minimist')
let puppeteer = require('puppeteer')
let fs = require('fs');

let args = minimist(process.argv)

//reading config.json and converting to json object for accessing the data 
let configJSON = fs.readFileSync(args.config , "utf-8");
let configJSO = JSON.parse(configJSON);

//Reading the code file which we want to code on hackerrank
let codeSolution = fs.readFileSync(args.codeFile, "utf-8");

async function run(){
    let browser = await puppeteer.launch(
        {
            headless: false,
            args:[
                '--start-maximized' // you can also use '--start-fullscreen'
             ],
             defaultViewport : null
        }
        );

    let pages = await browser.pages();
    let page = pages[0];



    //visting the hackerrank url
    await page.goto(args.url)

    //waiting for the login selector to load & clicking the first login button present on screen
    await page.waitForSelector("a[href = 'https://www.hackerrank.com/access-account/']");
    await page.click("a[href = 'https://www.hackerrank.com/access-account/']");

    //waiting for the next login on next page selector to  & clicking the Developer section login button
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']")
    await page.click("a[href='https://www.hackerrank.com/login']")

    //now writing the username and password in login section
    await page.waitForSelector("input[name = 'username']")
    await page.type("input[name = 'username']", configJSO.username, {delay : 30} );

    await page.waitForSelector("input[name = 'password']")
    await page.type("input[name = 'password']", configJSO.password, {delay : 50});

    // now after entering all credentials we need to press login 
    await page.waitForSelector("button[data-analytics = 'LoginPassword']")
    await page.click("button[data-analytics = 'LoginPassword']")

    await page.waitFor(3000);
    //now clicking on the algorithm section on hackerrank after successful login in
    await page.waitForSelector("div[data-automation = 'algorithms']")
    await page.click("div[data-automation = 'algorithms']")

    //clicking on the our first question SUM OF ARRAYS  
    await page.waitForSelector("a[data-attr1 = 'simple-array-sum']");
    await page.click("a[data-attr1 = 'simple-array-sum']");

    await page.waitFor(5000)
  
    //now type the solution of the code in the text editior
    // await page.waitForSelector(".view-lines")
    // await page.focus(".view-lines")
    // await page.keyboard.type(codeSolution, {delay : 30})

    await page.click(".checkbox-input")
    await page.type(".ui-tooltip-wrapper" ,codeSolution,{delay : 0.02})
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyC');
    await page.keyboard.up('Control');
    await page.waitFor(3000)
    await page.click(".checkbox-input") // to uncheck the box
    
    await page.click(".monaco-editor.no-user-select.vs")
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyV');
    
    //now clicking the run button to check any errors in code
    await page.click(".hr-monaco__run-code")
    await page.waitFor(7000);


    // now clicking on submit button 
    await page.click(".hr-monaco-submit");

    await page.waitFor(12000);
    await page.close();


}

run()