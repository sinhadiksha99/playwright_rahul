import { expect, Locator, request, test } from "@playwright/test";

const payload = { userEmail: "dikshasinha@gmail.com", userPassword: "Diksha@123" };
const createOrderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }, { country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let orders:string[];
let token;

test.beforeAll(async() => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
        data: payload
    })
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: createOrderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
    const orderResponseJson = await orderResponse.json();
    orders = orderResponseJson.orders;
    console.log(orderResponseJson)
})

test("e-commerce - order", async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value) }, token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
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