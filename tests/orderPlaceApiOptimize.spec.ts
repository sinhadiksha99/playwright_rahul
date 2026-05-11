import { expect, Locator, request, test } from "@playwright/test";
import { APIUtilsOptimize } from "../utils/APIUtils";

let response;
test.beforeAll(async() => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtilsOptimize(apiContext);
    response = await apiUtils.createOrder();
})

test("e-commerce - order optimize", async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value) }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    const orders = response.order;
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.getByText("Your Orders").waitFor({ state: 'visible' });
    const rows: Locator[] = await page.locator("tbody .ng-star-inserted").all();
    for (const row of rows) {
        let id = await row.locator("th").textContent();
        const orderId = id?.trim();
        if (orderId?.trim() === orders[0].trim() || orderId?.trim() === orders[1].trim()) {
            await row.locator("button").first().click();
            await page.getByText("Order Id").waitFor({ state: 'visible' });
            const currId = await page.locator("div.col-text").textContent();
            expect(currId?.trim()).toBe(orderId);
            await page.locator("button[routerlink='/dashboard/myorders']").click();
            await page.getByText("Your Orders").waitFor({ state: 'visible' });
        }
    }
})