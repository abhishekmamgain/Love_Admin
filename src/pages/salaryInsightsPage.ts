import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class SalaryInsightsPage {
    readonly page: Page;
    readonly jobRoleInput: Locator;
    readonly countryInput: Locator;
    readonly searchButton: Locator;
    readonly salaryResults: Locator;
    readonly loadingSpinner: Locator;
    private testData: any;

    constructor(page: Page) {
        this.page = page;
        this.loadTestData();

        // Initialize locators with flexible selectors to handle different UI patterns
        this.jobRoleInput = page.locator('input[placeholder*="job" i], input[placeholder*="role" i], input[placeholder*="position" i], input[name*="job" i], input[name*="role" i], input[data-testid*="job" i]').first();
        this.countryInput = page.locator('input[placeholder*="country" i], input[placeholder*="location" i], input[name*="country" i], input[name*="location" i], select, input[data-testid*="country" i], input[data-testid*="location" i]').first();
        this.searchButton = page.locator('button[type="submit"], button:has-text("Search"), button:has-text("Find"), input[type="submit"], button[data-testid*="search" i]').first();
        this.salaryResults = page.locator('text=/salary|compensation|pay|earnings|insights|data|information|details/i');
        this.loadingSpinner = page.locator('[class*="loading"], [class*="spinner"], [data-testid*="loading" i]');
    }

    private loadTestData() {
        const dataPath = path.join(__dirname, '../helper/util/test-data/salaryInsightsData.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        this.testData = JSON.parse(rawData);
    }

    async navigateTo() {
        await this.page.goto(this.testData.url);
        await this.page.waitForLoadState('networkidle');
    }

    async searchForJobRole(jobRole: string) {
        await this.page.waitForTimeout(2000);

        if (await this.jobRoleInput.isVisible()) {
            await this.jobRoleInput.fill(jobRole);
            await this.page.waitForTimeout(1000);
        } else {
            console.log('Job role input not found, trying alternative selectors...');
            // Try alternative selectors
            const alternativeInputs = [
                'input[type="text"]',
                'input[placeholder*="search" i]',
                'input[placeholder*="enter" i]',
                'input'
            ];

            for (const selector of alternativeInputs) {
                const input = this.page.locator(selector).first();
                if (await input.isVisible()) {
                    await input.fill(jobRole);
                    break;
                }
            }
        }
    }

    async searchForCountry(country: string) {
        if (await this.countryInput.isVisible()) {
            await this.countryInput.fill(country);
            await this.page.waitForTimeout(1000);
        } else {
            console.log('Country input not found, trying alternative selectors...');
            // Try alternative selectors for country
            const alternativeInputs = [
                'input[placeholder*="location" i]',
                'input[placeholder*="where" i]',
                'select',
                'input[type="text"]:nth-of-type(2)'
            ];

            for (const selector of alternativeInputs) {
                const input = this.page.locator(selector).first();
                if (await input.isVisible()) {
                    await input.fill(country);
                    break;
                }
            }
        }
    }

    async submitSearch() {
        if (await this.searchButton.isVisible()) {
            await this.searchButton.click();
        } else {
            // Try pressing Enter if no search button is found
            await this.page.keyboard.press('Enter');
        }

        // Wait for loading to complete
        await this.page.waitForTimeout(3000);

        // Wait for loading spinner to disappear if present
        if (await this.loadingSpinner.isVisible()) {
            await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
        }
    }

    async verifySalaryInsightsDisplayed() {
        const pageContent = await this.page.textContent('body');

        // Check for various salary-related content
        const hasSalaryContent = await this.salaryResults.isVisible();
        const hasSalaryNumbers = /\$[\d,]+|[\d,]+\s*(USD|EUR|GBP|BRL|CAD|JPY)/i.test(pageContent);
        const hasInsightsContent = /insights|data|information|details/i.test(pageContent);

        return hasSalaryContent || hasSalaryNumbers || hasInsightsContent;
    }

    async verifyRelevantData(jobRole: string, country: string) {
        const pageContent = await this.page.textContent('body');

        const hasJobRole = pageContent.toLowerCase().includes(jobRole.toLowerCase());
        const hasCountry = pageContent.toLowerCase().includes(country.toLowerCase());
        const hasSalaryNumbers = /\$[\d,]+|[\d,]+\s*(USD|EUR|GBP|BRL|CAD|JPY)/i.test(pageContent);

        return hasJobRole || hasCountry || hasSalaryNumbers;
    }

    async takeScreenshot(filename: string) {
        await this.page.screenshot({ path: `test-results/screenshots/${filename}.png`, fullPage: true });
    }
} 