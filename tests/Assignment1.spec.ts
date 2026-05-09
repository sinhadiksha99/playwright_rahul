import { expect, request, test } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
const USER_EMAIL = 'dikshasinha99@gmail.com';
const USER_PASSWORD = 'Diksha@123';
const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};
let token;
test.beforeAll(async ({ }) => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login", {
        data: {
            email: USER_EMAIL,
            password: USER_PASSWORD
        }
    });
    const reponseJson = await loginResponse.json();
    token = reponseJson.token;
})

test('API-1', async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem("eventhub_token", value) }, token);
    await page.goto(`${BASE_URL}/login`);
    await page.route("https://api.eventhub.rahulshettyacademy.com/api/events**", async route => {
        const realResponse = await route.fetch();
        await route.fulfill({
            response: realResponse,
            body: JSON.stringify(SIX_EVENTS_RESPONSE)

        })
    })
    await page.goto(`${BASE_URL}/events`);
    await page.waitForResponse("https://api.eventhub.rahulshettyacademy.com/api/events**");
    expect(await page.getByTestId("event-card").count()).toBe(6);
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('9 bookings');
});

test('API-2', async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem("eventhub_token", value) }, token);
    await page.goto(`${BASE_URL}/login`);
    await page.route("https://api.eventhub.rahulshettyacademy.com/api/events**", async route => {
        const realResponse = await route.fetch();
        await route.fulfill({
            response: realResponse,
            body: JSON.stringify(FOUR_EVENTS_RESPONSE)

        })
    })
    await page.goto(`${BASE_URL}/events`);
    await page.waitForResponse("https://api.eventhub.rahulshettyacademy.com/api/events**");
    expect(await page.getByTestId("event-card").count()).toBe(4);
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).not.toBeVisible();
});