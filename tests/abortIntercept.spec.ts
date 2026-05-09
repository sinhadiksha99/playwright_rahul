import { expect, Locator, test } from "@playwright/test";

test("network intercept - abort ", async ({ page }) => {
    await page.route("**/*.{jpg,png,jpeg,gif,svg}", async route => {
        await route.abort()
    })
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    const loginDetails: Locator[] = await page.locator("b i").all()
    const username = await loginDetails[0].textContent() ?? ""
    const password = await loginDetails[1].textContent() ?? ""
    await page.locator('[name="username"]').fill(username)
    await page.locator('[name="password"]').fill(password)
    await page.locator('[name="signin"]').click()
    await page.waitForSelector(".card-body", { state: "visible" })
});
