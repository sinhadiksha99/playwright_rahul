import { expect, request } from "@playwright/test";

export class APIUtilsOptimize {
    apiContext;
    constructor(apiContext) {
        this.apiContext = apiContext;
    }
    token;
    orders;
    payload = { userEmail: "dikshasinha@gmail.com", userPassword: "Diksha@123" };
    createOrderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }, { country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.payload
        })
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        this.token = loginResponseJson.token;
        return this.token;
    }

    async createOrder() {
        let response = {
            token: "",
            order: []
        }
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: this.createOrderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        })
        const orderResponseJson = await orderResponse.json();
        this.orders = orderResponseJson.orders;
        console.log(orderResponseJson);
        response.order = this.orders;
        return response;
    }
}