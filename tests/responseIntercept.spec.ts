import { expect, request, test } from "@playwright/test";
import { APIUtilsOptimize } from "./utils/APIUtils";

let response: any;
let fakePayloadOrder = { data: [], message: "No Orders" };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtilsOptimize(apiContext);
    response = await apiUtils.createOrder();
})

test("network intercept - response (orders)", async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value) }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.waitForSelector(".card-body b", { state: 'attached' });
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            // const realResponse = await page.request.fetch(route.request());
            const realResponse = await route.fetch();
            let body = JSON.stringify(fakePayloadOrder);
            await route.fulfill({
                response: realResponse,
                body
            })
            /*intercepting the response i.e api will give back the response and that response 
             we will send it to browser using that browser will render data on frontend 
             but here we will hijack the response send data what we want as response */
        }
    )
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent())
});

/* here we have created orders but what we want is to see no orders on my orders page
 and for that i want playwright to mock this no orders api call response */

