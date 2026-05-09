import { expect, Locator, test } from "@playwright/test"

test("login - incorrect", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    await page.locator('[name="username"]').fill("rahulshetty")
    await page.locator('[name="password"]').fill("learning")
    await page.locator('[name="signin"]').click()
    await expect(page.locator(".alert-danger")).toHaveText("Incorrect username/password.")
    await expect(page.locator(".alert-danger")).toHaveAttribute("style", "display: block;")
})

test("login - correct", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    const loginDetails: Locator[] = await page.locator("b i").all()
    const username = await loginDetails[0].textContent() ?? ""
    const password = await loginDetails[1].textContent() ?? ""
    await page.locator('[name="username"]').fill(username)
    await page.locator('[name="password"]').fill(password)
    await page.locator('[name="signin"]').click()
    await page.waitForSelector(".card-title a")
    console.log(await page.locator(".card-title a").nth(0).textContent())
    const titleOfProducts: string[] = await page.locator(".card-title a").allTextContents()
    console.log(titleOfProducts)
})

test("login - dropdown", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    const loginDetails: Locator[] = await page.locator("b i").all()
    const username = await loginDetails[0].textContent() ?? ""
    const password = await loginDetails[1].textContent() ?? ""
    await page.locator('[name="username"]').fill(username)
    await page.locator('[name="password"]').fill(password)
    const dropdown = page.locator("select")
    await dropdown.selectOption("Consultant")
    await page.locator('[value="user"]').click()
    await page.locator("#okayBtn").click()
    await expect(page.locator('[value="user"]')).toBeChecked()
    await page.locator("#terms").check()
    await expect(page.locator('#terms')).toBeChecked()
    await page.locator("#terms").uncheck()
    await expect(page.locator('#terms')).not.toBeChecked()
    const blinkDocReq = page.locator("[href*='/documents-request']")
    await expect(blinkDocReq).toHaveClass("blinkingText");
    await page.locator('[name="signin"]').click()
    await page.waitForSelector(".card-title a")
    console.log(await page.locator(".card-title a").nth(0).textContent())
    const titleOfProducts: string[] = await page.locator(".card-title a").allTextContents()
    console.log(titleOfProducts)
})

test("login - new page handle", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    const blinkDocReq = page.locator("[href*='/documents-request']")
    await expect(blinkDocReq).toHaveClass("blinkingText");
    const [page2] = await Promise.all([context.waitForEvent("page"), blinkDocReq.click()]);
    console.log(await page.title())
    const textCon = await page2.locator(".red").textContent()
    const emailId = textCon?.split(" ")[4];
    console.log(emailId);
})