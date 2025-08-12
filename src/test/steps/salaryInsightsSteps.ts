import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import { SalaryInsightsPage } from "../../pages/salaryInsightsPage";

setDefaultTimeout(60 * 1000 * 2);

let salaryInsightsPage: SalaryInsightsPage;

Given('I navigate to the salary insights page', async () => {
    salaryInsightsPage = new SalaryInsightsPage(fixture.page);
    await salaryInsightsPage.navigateTo();
});

When('I search for {string} in {string}', async (jobRole: string, country: string) => {
    await salaryInsightsPage.searchForJobRole(jobRole);
    await salaryInsightsPage.searchForCountry(country);
    await salaryInsightsPage.submitSearch();
});

Then('I should see salary insights displayed', async () => {
    const hasInsights = await salaryInsightsPage.verifySalaryInsightsDisplayed();
    expect(hasInsights).toBeTruthy();
});

Then('the salary data should be relevant to {string} and {string}', async (jobRole: string, country: string) => {
    const isRelevant = await salaryInsightsPage.verifyRelevantData(jobRole, country);
    expect(isRelevant).toBeTruthy();

    // Take a screenshot for verification
    await salaryInsightsPage.takeScreenshot(`salary-insights-${jobRole}-${country}`);
}); 