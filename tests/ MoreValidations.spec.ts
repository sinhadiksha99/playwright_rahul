import { test, expect } from '@playwright/test'

test("More Validation", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://www.google.com/");
    await page.goBack();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).not.toBeVisible();
    page.on("dialog", dialog => { dialog.accept(); console.log(dialog.message()) })
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    await expect(page.getByText("Top", { exact: true })).toBeVisible();
    const frame = await page.frameLocator("#courses-iframe");
    await frame.getByRole('link', { name: 'Courses', exact: true }).click();
})

test("Screenshot Validation", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://www.google.com/");
    await page.goBack();
    await expect(page.locator("#displayed-text")).toBeVisible();
    // await page.locator("#displayed-text").screenshot({ path:"partial.png"});
    // await page.screenshot({ path: "screesnhot.png" });
    await expect(page).toHaveScreenshot("page.png");
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).not.toBeVisible();
});