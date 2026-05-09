import { expect, test } from "@playwright/test";

test("locators strategy", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    await page.getByPlaceholder("Password").fill("Diksha@123");
    await page.getByLabel("Gender").selectOption({ label: "Female" });
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText('× Success! The Form has been')).toBeVisible();
    await page.getByRole("link", { name: "Shop" }).click();
    await expect(page.getByText('Shop Name')).toBeVisible();
    await page.locator("app-card").filter({ hasText: "Nokia Edge" }).getByRole("button").click();
})