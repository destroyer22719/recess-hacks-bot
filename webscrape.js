const puppeteer = require("puppeteer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const webscrape = async() => {
    console.log("Web scraping");
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://manage.devpost.com/challenges/12383-recess-hacks/dashboard/reports/activity", {"waitUntil":"domcontentloaded"});
    await page.type("#user_email", `${process.env.DEVPOST_EMAIL}`);
    await page.type("#user_password", `${process.env.DEVPOST_PASSWORD}`);
    await page.click("#submit-form");
    await page.waitForNavigation();
    await page.$eval("#interval-from", (el) => el.value = "2021-04-24");
    await page.click(`input[value="Update"]`);
    await page.waitForTimeout(1000);
    await page.click("#metrics_export_type_of_report_registrant");
    await page.click("#submit-container input");
    await page.waitForSelector("#report-link > a");
    await page.waitForTimeout(500);
    await page.click("#report-link > a");
    const file = fs.readdirSync(path.join(__dirname, "data", "csv"));
    if (file.length) fs.unlinkSync(path.join(__dirname, "data", "csv", file[0]));
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: path.join(__dirname, "data", "csv")});
    await page.waitForTimeout(2000)
    await browser.close();
}

module.exports = webscrape;