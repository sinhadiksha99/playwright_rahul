import { expect, Locator, test } from "@playwright/test";
import { POManager } from "../pageObjects/POManager";
import * as fs from "fs"; 
import path from "path";

const loginData = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../utils/shoppingData.json"),
        "utf-8"
    )
)

test("e-commerce", async ({ page }) => {
    const manager = new POManager(page);
    const loginPage = manager.getLoginPage();
    await loginPage.goTo();
    await loginPage.loginApp("dikshasinha@gmail.com", "Diksha@123");
    console.log(await page.title());

    await page.waitForSelector(".card-body b", { state: 'attached' });
    console.log(await page.locator(".card-body b").allTextContents())
    const prodName1 = "ZARA COAT 3";
    const prodName2 = "ADIDAS ORIGINAL";
    const country = "India";
    const dashboardPage = manager.getDashboardPage();
    await dashboardPage.searchProducts(prodName1);
    await dashboardPage.searchProducts(prodName2)
    await dashboardPage.goToCart();

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

test('Client App login', async ({ page }) => {
    const poManager = new POManager(page);
    const productName = 'Zara Coat 4';
    const products = page.locator(".card-body");
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.loginApp("dikshasinha@gmail.com", "Diksha@123");
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProducts(productName);
    await dashboardPage.goToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrderReviewsPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrderHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect((await ordersHistoryPage.getOrderId())?.trim()).toBe(orderId.trim())
});








