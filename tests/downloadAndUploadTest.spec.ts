import * as fs from 'fs'
import { test, expect } from '@playwright/test'
import { updateCellvalueWithMatch } from './excelOptimize'

test("Download and Upload", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/")
    if(!fs.existsSync("./downloads")){
        fs.mkdirSync("./downloads")
    }

    const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("#downloadButton").click()
    ])
    console.log(download.url())    
    await download.saveAs("./downloads/myfile.xlsx")
    console.log("✅ File downloaded!")
    await updateCellvalueWithMatch(
        "Apple",
        "./downloads/myfile.xlsx",
        "Exotic Fruits"
    )
    await page.waitForTimeout(2000);
    await page.locator("#fileinput").setInputFiles("/Users/dikshasinha/Desktop/playwright_rahul/downloads/myfile.xlsx");
})