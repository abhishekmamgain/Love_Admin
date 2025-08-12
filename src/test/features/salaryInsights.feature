Feature: Salary Insights Page Tests

  Background:
    Given I navigate to the salary insights page

  @salaryInsights
  Scenario Outline: Verify salary insights for different job roles and countries
    When I search for "<jobRole>" in "<country>"
    Then I should see salary insights displayed
    And the salary data should be relevant to "<jobRole>" and "<country>"

    Examples:
      | jobRole           | country |
      | Accountant        | Brazil  |
      | QA Engineer       | Canada  |
      | Software Engineer | Japan   | 