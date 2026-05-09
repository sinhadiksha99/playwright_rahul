import { expect, Locator, test } from "@playwright/test";

test("e-commerce", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill("dikshasinha@gmail.com")
    await page.getByPlaceholder("enter your passsword").fill("Diksha@123")
    await page.locator("#login").click();
    console.log(await page.title());
    await page.waitForSelector(".card-body b", { state: 'attached' });
    console.log(await page.locator(".card-body b").allTextContents())
    const prodName1 = "ZARA COAT 3";
    const prodName2 = "ADIDAS ORIGINAL";
    const country = "India";
    const products = await page.locator(".card-body").all();
    for (const product of products) {
        const productName = await product.locator("b").textContent();
        if (prodName1 === productName || prodName2 === productName) {
            await product.locator(".fa-shopping-cart").click();
            await page.getByText("Product Added To Cart").waitFor({ state: 'visible' });
        }
    }
    await page.locator("[routerlink='/dashboard/cart']").click();
    await page.getByText("My Cart").waitFor({ state: 'visible' });
    await page.getByText("Checkout").click();
    await expect(page.locator(".user__name label")).toHaveText("dikshasinha@gmail.com");
    await page.getByPlaceholder("Select Country").pressSequentially("ind");
    await page.locator(".ta-results button")
        .filter({ has: page.getByText(country, { exact: true }) }).click();
    await page.locator(".action__submit").click();
    console.log(await page.locator("h1").textContent())
    const orderIds = await page.locator(".em-spacer-1 .ng-star-inserted").allTextContents();
    for (const ids in orderIds) {
        orderIds[ids] = orderIds[ids].split(" ")[2];
    }
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.getByText("Your Orders").waitFor({ state: 'visible' });
    const rows: Locator[] = await page.locator("tbody .ng-star-inserted").all();
    for (const row of rows) {
        let id = await row.locator("th").textContent();
        const orderId = id?.trim();
        if (orderId?.trim() === orderIds[0].trim() || orderId?.trim() === orderIds[1].trim()) {
            await row.locator("button").first().click();
            await page.getByText("Order Id").waitFor({ state: 'visible' });
            const currId = await page.locator("div.col-text").textContent();
            expect(currId?.trim()).toBe(orderId);
            await page.locator("button[routerlink='/dashboard/myorders']").click();
            await page.getByText("Your Orders").waitFor({ state: 'visible' });
        }
    }
})