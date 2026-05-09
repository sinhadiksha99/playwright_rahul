import { expect, test } from "@playwright/test"

test("Calendar", async ({ context }) => {
    const month = 6;
    const date = 15;
    const year = 2050
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/")
    const [childPage] = await Promise.all([context.waitForEvent("page"), page.getByText("Top Deals").click()]);
    await childPage.locator("div[class*='date-picker__inputGroup']").click();
    const currentDate = await childPage.locator('span[class*="react-calendar__navigation"]').textContent();
    const currYear = Number(currentDate?.split(" ")[0]);
    if (currYear != year) {
        await childPage.locator('span[class*="react-calendar__navigation"]').click();
        await childPage.locator('span[class*="react-calendar__navigation"]').click();
        let currentYearRange = await childPage.locator('span[class*="react-calendar__navigation"]').textContent();
        let yearArr: String[] = currentYearRange?.split(" ") ?? [];
        console.log(yearArr);
        let startRange = Number(yearArr[0].trim());
        let endRange = Number(yearArr[2].trim());
        while (true) {
            if (year >= startRange && year <= endRange) {
                await childPage.getByRole('button', { name: year.toString(), exact: true }).click();
                break;
            }
            else if (year < startRange) {
                await childPage.locator('button[class*="navigation__prev-button"]').click();
                await childPage.waitForTimeout(1000);
            }
            else {
                await childPage.locator('button[class*="navigation__next-button"]').click();
                await childPage.waitForTimeout(1000);
            }
            currentYearRange = await childPage.locator('span[class*="react-calendar__navigation"]').textContent();
            yearArr = currentYearRange?.split(" ") ?? [];
            startRange = Number(yearArr[0].trim());
            endRange = Number(yearArr[2].trim());
        }
    }
    await childPage.locator("[class*='view__months__month']").nth(month - 1).click();
    await childPage.locator(`//abbr[text()='${date.toString()}']`).first().click();
    await page.waitForTimeout(1000);
    const actualDate = await childPage.locator("[name='date']").inputValue();
    await expect(actualDate).toBe("2050-06-15");

})