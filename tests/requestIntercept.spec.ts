import { expect, request, test } from "@playwright/test";
import { APIUtilsOptimize } from "../utils/APIUtils";

let response;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtilsOptimize(apiContext);
    response = await apiUtils.createOrder();
})

test("network intercept - request (orders)", async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value) }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.waitForSelector(".card-body b", { state: 'attached' });
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        async route => {
            await route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=69fe0187e83610b531d1234c" });
        });
    await page.locator("button:has-text('View')").first().click();
    console.log(await page.locator("p.blink_me").textContent())
});