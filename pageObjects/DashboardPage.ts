import { Locator, Page } from "@playwright/test";

export class DashboardPage {
    page: Page
    readonly products: Locator;
    readonly productName: Locator;
    readonly cart: Locator;
    readonly cartText: Locator;
    readonly orders: Locator;
    constructor(page: Page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productName = page.locator(".card-body b");
        this.cart = page.locator("[routerlink='/dashboard/cart']")
        this.cartText = page.getByText("My Cart")
        this.orders = page.locator("button[routerlink*='myorders']");
    }

    async searchProducts(productName: string) {
        const products = await this.products.all();
        for (const product of products) {
            const currproductName = await product.locator("b").textContent();
            if (currproductName === productName) {
                await product.locator(".fa-shopping-cart").click();
                await this.page.getByText("Product Added To Cart").waitFor({ state: 'visible' });
            }
        }
    }

    async goToCart() {
        await this.cart.click();
        await this.cartText.waitFor({ state: 'visible' });
    }

    async navigateToOrders() {
        await this.orders.click();
    }
}