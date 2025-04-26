import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from 'playwright';


setDefaultTimeout(60 * 1000 * 2)

import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
let browser: Browser;
let page: Page;

// Given('user search for a {string}', async function (book) {
//     fixture.logger.info("Searching for a book: " + book)
//     await fixture.page.locator("input[type='search']").type(book);
//     await fixture.page.waitForTimeout(2000);
//     await fixture.page.locator("mat-option[role='option'] span").click();
// });
// When('user add the book to the cart', async function () {
//     await fixture.page.locator("//button[@color='primary']").click();
//     const toast = fixture.page.locator("simple-snack-bar");
//     await expect(toast).toBeVisible();
//     await toast.waitFor({ state: "hidden" })
// });
// Then('the cart badge should get updated', async function () {
//     const badgeCount = await fixture.page.locator("#mat-badge-content-0").textContent();
//     expect(Number(badgeCount)).toBeGreaterThan(0);
// });


Given('I navigate to the SimplyBook.me signup page', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://simplybook.me/signup');
});

When('I fill in the registration form with valid data', async () => {
    await page.fill('input[name="company"]', 'My Test Company');
    await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
});

Then('I should see a success message confirming account creation', async () => {
    await page.waitForSelector('text=Your booking site has been created');
    const successMessage = await page.locator('text=Your booking site has been created').isVisible();
    expect(successMessage).toBeTruthy();
    await browser.close();
});

const testEmail = 'testuser@example.com'; // Replace with real email created from registration
const testPassword = 'Test@1234';

Given('I have an existing SimplyBook.me account', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://simplybook.me/');
});

When('I login using the correct email and password', async () => {
    await page.click('text=Login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
});

Then('I should be redirected to the dashboard page', async () => {
    await page.waitForURL(/.*dashboard.*/);
    const isOnDashboard = await page.url().includes('dashboard');
    expect(isOnDashboard).toBeTruthy();
    await browser.close();
});


Given('I am logged in to SimplyBook.me', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://simplybook.me/');
    await page.click('text=Login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL(/.*dashboard.*/);
});

When('I navigate to the booking page', async () => {
    // Replace with your actual business booking site
    await page.goto('https://yourcompany.simplybook.me/v2/');
});

When('I select a service and an available time slot', async () => {
    // Wait for service list and click the first one
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child'); // Adjust selector as needed

    // Wait for time slots to load and click the first available one
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot'); // Adjust to match your site
});

When('I confirm the booking', async () => {
    await page.click('text=Book now'); // Change selector/text if needed
});

Then('I should see a booking confirmation message', async () => {
    await page.waitForSelector('text=Your booking is confirmed');
    const confirmationVisible = await page.isVisible('text=Your booking is confirmed');
    expect(confirmationVisible).toBeTruthy();
});

Then('the booking should appear in my account history', async () => {
    // Navigate to account history or profile page — adjust this
    await page.goto('https://yourcompany.simplybook.me/account/');

    const bookingEntry = await page.locator('text=Booking History').isVisible();
    expect(bookingEntry).toBeTruthy();

    await browser.close();
});

const bookingUrl = 'https://yourcompany.simplybook.me/v2/'; // Replace with your booking site
const discountCode = 'DISCOUNT10'; // Replace with actual coupon created in the admin panel

Given('I am on the booking page and have selected a service', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto(bookingUrl);

    // Select first service
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child');

    // Select time slot
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot');
});

When('I apply a valid discount code', async () => {
    // Wait for the discount/coupon code field
    await page.waitForSelector('input[placeholder="Coupon code"]');
    await page.fill('input[placeholder="Coupon code"]', discountCode);

    // Apply the code
    await page.click('text=Apply'); // Adjust if button text differs
});

Then('the total price should be updated with the discount', async () => {
    // Wait for updated price
    await page.waitForTimeout(1000); // Allow UI to update

    const priceText = await page.locator('.total-price').innerText(); // Adjust selector
    console.log('Updated Price:', priceText);

    // Expect the price to show the discounted amount (you can match with regex or specific value)
    expect(priceText).toMatch(/\$/); // Example check, adjust as needed

    await browser.close();
});



Given('I am on the checkout page after selecting a service', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto(bookingUrl);

    // Select a service
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child');

    // Select a time slot
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot');

    // Fill required client info if prompted (e.g., name/email)
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
    }

    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
        await emailInput.fill(`test${Date.now()}@mail.com`);
    }

    // Click "Book Now" to go to checkout
    await page.click('text=Book now'); // Adjust if button label differs
});

When('I choose a payment method and complete the transaction', async () => {
    // Wait for payment methods to show
    await page.waitForSelector('input[type="radio"][name="paymentMethod"]'); // Example selector

    // Select the first available payment method
    const paymentOption = page.locator('input[type="radio"][name="paymentMethod"]').first();
    await paymentOption.check();

    // Click on "Pay Now" or equivalent
    await page.click('text=Pay now'); // Adjust based on actual button text

    // Simulate payment processing time (or handle gateway iframe if applicable)
    await page.waitForSelector('text=Payment Successful', { timeout: 10000 });
});

Then('I should see a payment confirmation message', async () => {
    const confirmation = await page.isVisible('text=Payment Successful'); // Adjust as needed
    expect(confirmation).toBeTruthy();
});

Then('the payment should appear in the booking history', async () => {
    // Navigate to booking history
    await page.goto('https://yourcompany.simplybook.me/account/'); // Replace with actual history URL

    const hasPaymentRecord = await page.locator('text=Paid').first().isVisible(); // Adjust selector
    expect(hasPaymentRecord).toBeTruthy();

    await browser.close();
});


Given('I have an existing booking', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto(bookingUrl);

    // Select a service
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child');

    // Select a time slot
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot');

    // Fill required client info if prompted
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
    }

    const email = `test${Date.now()}@mail.com`;
    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
        await emailInput.fill(email);
    }

    // Confirm the booking
    await page.click('text=Book now');
    await page.waitForSelector('text=Your booking is confirmed');
});

When('I navigate to the booking management page', async () => {
    // Navigate to booking management — update with your real path
    await page.goto('https://yourcompany.simplybook.me/account/');
    await page.waitForSelector('text=Booking History');
});

When('I change the appointment time', async () => {
    // Click the edit or reschedule button
    await page.click('text=Edit'); // Adjust to actual button text

    // Wait for rescheduling options to appear
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot:nth-child(2)'); // Choose a different slot

    await page.click('text=Reschedule'); // Adjust if button text differs
});

Then('the updated booking details should be reflected', async () => {
    // Verify updated time slot appears in confirmation or history
    const updatedSlotVisible = await page.isVisible('text=Updated'); // Adjust as needed
    expect(updatedSlotVisible).toBeTruthy();

    await browser.close();
});

Given('I have a confirmed booking', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto(bookingUrl);

    // Select a service
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child');

    // Select a time slot
    await page.waitForSelector('.timeslot');
    await page.click('.timeslot');

    // Fill in booking details
    const name = 'Test User';
    const email = `test${Date.now()}@mail.com`;

    if (await page.isVisible('input[name="name"]')) {
        await page.fill('input[name="name"]', name);
    }

    if (await page.isVisible('input[name="email"]')) {
        await page.fill('input[name="email"]', email);
    }

    await page.click('text=Book now');
    await page.waitForSelector('text=Your booking is confirmed');

    // Store for reuse if needed
});

When('I cancel the booking', async () => {
    await page.goto('https://yourcompany.simplybook.me/account/'); // Adjust path if needed

    // Click the Cancel button for the first booking
    await page.waitForSelector('text=Cancel');
    await page.click('text=Cancel');

    // Confirm the cancellation in dialog if prompted
    if (await page.isVisible('text=Are you sure')) {
        await page.click('text=Yes'); // or 'Confirm' depending on UI
    }

    await page.waitForSelector('text=Booking cancelled');
});

Then('I should see a cancellation confirmation', async () => {
    const cancelledMsg = await page.isVisible('text=Booking cancelled');
    expect(cancelledMsg).toBeTruthy();
});

Then('a refund should be initiated', async () => {
    // You can check for refund notification or a transaction log
    const refundVisible = await page.isVisible('text=Refund initiated'); // Adjust as needed
    expect(refundVisible).toBeTruthy();
});

Then('the booking should no longer appear in my booking history', async () => {
    // Confirm that booking list is empty or updated
    const noBooking = await page.locator('text=No bookings found').isVisible().catch(() => false);
    expect(noBooking).toBeTruthy();

    await browser.close();
});

const loginUrl = 'https://yourcompany.simplybook.me/v2/';
const accountUrl = 'https://yourcompany.simplybook.me/account/'; // Adjust if needed

Given('I am logged into my SimplyBook.me account', async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto(loginUrl);

    // Start by making a new booking to simulate a logged-in session
    await page.waitForSelector('.service-list');
    await page.click('.service-list .service-item:first-child');

    await page.waitForSelector('.timeslot');
    await page.click('.timeslot');

    const email = `test${Date.now()}@mail.com`;

    if (await page.isVisible('input[name="name"]')) {
        await page.fill('input[name="name"]', 'Logout Tester');
    }

    if (await page.isVisible('input[name="email"]')) {
        await page.fill('input[name="email"]', email);
    }

    await page.click('text=Book now');
    await page.waitForSelector('text=Your booking is confirmed');

    // Navigate to account page to ensure session is active
    await page.goto(accountUrl);
    await page.waitForSelector('text=Booking History');
});

When('I click the logout button', async () => {
    // Click logout (adjust the selector if it's a menu or icon)
    await page.click('text=Logout'); // Could be a button or dropdown menu item
});

Then('I should be redirected to the login or home page', async () => {
    // Wait for redirection
    await page.waitForLoadState('domcontentloaded');

    const url = page.url();
    expect(url).toMatch(/login|home|v2/); // Adjust based on where logout redirects
});

Then('I should no longer have access to the account dashboard', async () => {
    // Try to revisit the account page
    await page.goto(accountUrl);
    const accessDenied = await page.isVisible('text=Please log in'); // Adjust message

    expect(accessDenied).toBeTruthy();

    await browser.close();
});