import { Page } from "@playwright/test";
import { DashboardPage } from "./DashboardPage";
import { LoginPage } from "./loginPage";
import { CartPage } from "./CartPage";
import { OrdersHistoryPage } from "./OrderHistoryPage";
import { OrdersReviewPage } from "./OrdersReviewPage";

export class POManager {
    page: Page;
    readonly loginPage: LoginPage;
    readonly dashboardPage: DashboardPage;
    readonly cartPage: CartPage;
    readonly orderHistoryPage : OrdersHistoryPage;
    readonly orderReviewsPage : OrdersReviewPage;
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.orderHistoryPage = new OrdersHistoryPage(page);
        this.orderReviewsPage = new OrdersReviewPage(page);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.dashboardPage;
    }

    getCartPage(){
        return this.cartPage;
    }

    getOrderHistoryPage(){
        return this.orderHistoryPage;
    }

    getOrderReviewsPage(){
        return this.orderReviewsPage;
    }
}