import { expect, request, test } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
const USER_EMAIL_GMAIL = 'dikshasinha99@gmail.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';
const USER_EMAIL_YAHOO = 'dikshasinha99@yahoo.com';
const USER_PASSWORD = 'Diksha@123';

let token_yahoo;
test.beforeAll(async ({ }) => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login", {
        data: {
            email: USER_EMAIL_YAHOO,
            password: USER_PASSWORD
        }
    });
    const reponseJson = await loginResponse.json();
    token_yahoo = reponseJson.token;
})

test('API-1', async ({ request, page }) => {
    const eventResponse = await request.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token_yahoo}` },
    });
    const eventResponseBody = await eventResponse.json();
    const eventId = eventResponseBody.data[0].id;
    console.log(eventId);
    const bookingPayload = {
        "eventId": eventId,
        "customerName": "Yahoo User",
        "customerEmail": "priya.sharma@email.com",
        "customerPhone": "+91-9876543210",
        "quantity": 1
    }
    const bookingResponse = await request.post(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token_yahoo}` },
        data: bookingPayload
    });
    const bookingResponseBody = await bookingResponse.json();
    console.log(bookingResponseBody)
    const bookingId = bookingResponseBody.data.id;
    console.log(bookingId);
    await loginAs(page, USER_EMAIL_GMAIL,USER_PASSWORD );
    await page.goto(`${BASE_URL}/bookingId`);
    await expect(page.locator('.next-error-h1')).toBeVisible();
});

async function loginAs(page, user, password) {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(user);
    await page.getByLabel('Password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}
