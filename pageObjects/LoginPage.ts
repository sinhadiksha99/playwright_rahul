import { Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page
    readonly loginBtn: Locator
    readonly userEmail: Locator
    readonly password: Locator;
    constructor(page:Page) {
        this.page = page;
        this.loginBtn = page.locator("#login");
        this.userEmail = page.getByPlaceholder("email@example.com");
        this.password = page.getByPlaceholder("enter your passsword")
    }

    async loginApp(email: string, passsword: string):Promise<void> {
        await this.userEmail.fill(email);
        await this.password.fill(passsword);
        await this.loginBtn.click();
    }

    async goTo():Promise<void>{
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    }
}