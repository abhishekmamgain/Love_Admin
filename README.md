# Salary Insights Automated Tests

This project contains automated tests for the Deel Training Salary Insights page using Playwright with Cucumber and TypeScript.

## Test Overview

The automated tests cover the following scenarios for the URL: https://growth.deel.training/dev/salary-insights

### Test Scenarios
1. **Accountant, Brazil** - Search for Accountant role in Brazil and verify salary insights
2. **QA Engineer, Canada** - Search for QA Engineer role in Canada and verify salary insights  
3. **Software Engineer, Japan** - Search for Software Engineer role in Japan and verify salary insights

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Love_Admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## Running the Tests

### Run All Tests
```bash
npm test
```

### Run Only Salary Insights Tests
```bash
npm run test:salary-insights
```

### Run Tests in Debug Mode
```bash
npm run debug
```

### Run Failed Tests Only
```bash
npm run test:failed
```

## Test Reports

After running the tests, you can find:
- **HTML Reports**: Generated in the `test-results/` directory
- **Screenshots**: Captured during test execution in `test-results/screenshots/`
- **Videos**: Recorded test executions in `test-results/videos/`
- **Logs**: Detailed execution logs in `test-results/logs/`

## Project Structure

```
src/
├── pages/
│   └── salaryInsightsPage.ts      # Page Object for Salary Insights
├── test/
│   ├── features/
│   │   └── salaryInsights.feature # Cucumber feature file
│   └── steps/
│       └── salaryInsightsSteps.ts # Step definitions
├── helper/
│   ├── browsers/
│   │   └── browserManager.ts      # Browser management
│   ├── report/
│   │   ├── init.ts               # Report initialization
│   │   └── report.ts             # Report generation
│   └── util/
│       └── logger.ts             # Logging utilities
└── hooks/
    ├── hooks.ts                  # Cucumber hooks
    └── pageFixture.ts            # Page fixture setup
```

## Configuration

### Environment Configuration
- Tests run against the production environment by default
- Environment can be changed by modifying the `ENV` variable in package.json scripts

### Browser Configuration
- Tests run in non-headless mode by default for visibility
- Browser settings can be modified in `src/helper/browsers/browserManager.ts`

### Timeout Configuration
- Default timeout is set to 120 seconds (60 * 1000 * 2)
- Can be adjusted in the step definition files

## Test Features

### Page Object Model
- Uses Page Object Model pattern for better maintainability
- Encapsulates page interactions in `SalaryInsightsPage` class
- Flexible selectors to handle different UI patterns

### Robust Element Selection
- Multiple fallback selectors for form inputs
- Handles different placeholder text patterns
- Supports various button text variations

### Comprehensive Validation
- Verifies salary insights are displayed
- Validates data relevance to searched job role and country
- Checks for salary-related content and currency symbols

### Screenshot Capture
- Automatically captures screenshots for each test scenario
- Helps with debugging and verification

## Troubleshooting

### Common Issues

1. **Browser not found**
   ```bash
   npx playwright install
   ```

2. **Tests failing due to timing**
   - Increase timeout values in step definitions
   - Add additional wait conditions

3. **Element not found**
   - Check if the page structure has changed
   - Update selectors in `salaryInsightsPage.ts`

### Debug Mode
Run tests in debug mode to see the browser in action:
```bash
npm run debug
```

## Additional Improvements

The following improvements can be made to enhance the test suite:

1. **Data-Driven Testing**
   - Add more test data combinations
   - Support for external data sources (CSV, JSON)

2. **API Testing**
   - Add API tests for backend validation
   - Mock external dependencies

3. **Performance Testing**
   - Add performance benchmarks
   - Load testing scenarios

4. **Cross-Browser Testing**
   - Extend to multiple browsers (Chrome, Firefox, Safari)
   - Mobile browser testing

5. **Visual Regression Testing**
   - Add visual comparison tests
   - Screenshot comparison with baseline images

6. **Accessibility Testing**
   - Add accessibility compliance checks
   - Screen reader compatibility tests

7. **Security Testing**
   - Add security vulnerability checks
   - Input validation testing

8. **CI/CD Integration**
   - GitHub Actions workflow
   - Automated deployment pipeline

## Contributing

1. Follow the existing code structure
2. Add appropriate comments and documentation
3. Ensure all tests pass before submitting
4. Update the README for any new features

## License

This project is licensed under the ISC License.
