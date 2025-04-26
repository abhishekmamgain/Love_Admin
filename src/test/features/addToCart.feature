Feature: Add products to cart

  Background:
  # Given User navigates to the application
  # And User click on the login link

  @registerSteps
  Scenario Outline: Authenticated Users - Add to cart
    Given I navigate to the SimplyBook.me signup page
    When I fill in the registration form with valid data
    Then I should see a success message confirming account creation


  @login
  # User Login on SimplyBook.me

  Scenario: Successful login with valid credentials
    Given I have an existing SimplyBook.me account
    When I login using the correct email and password
    Then I should be redirected to the dashboard page


  @bookaservice
  # Book a Service on SimplyBook.me
  Scenario: Booking a service with a valid time slot
    Given I am logged in to SimplyBook.me
    When I navigate to the booking page
    And I select a service and an available time slot
    And I confirm the booking
    Then I should see a booking confirmation message
    And the booking should appear in my account history


  @discountCode
  # Apply a Discount Code on SimplyBook.me
  Scenario: Applying a valid discount code at checkout
    Given I am on the booking page and have selected a service
    When I apply a valid discount code
    Then the total price should be updated with the discount


  @makePayment
  # Make a Payment on SimplyBook.me
  Scenario: Completing a booking with payment
    Given I am on the checkout page after selecting a service
    When I choose a payment method and complete the transaction
    Then I should see a payment confirmation message
    And the payment should appear in the booking history

  @modifyBooking
  # Modify an existing booking on SimplyBook.me

  Scenario: Changing the appointment time
    Given I have an existing booking
    When I navigate to the booking management page
    And I change the appointment time
    Then the updated booking details should be reflected


  @cancelBooking
  # Cancel a booking and verify refund on SimplyBook.me

  Scenario: Cancelling a confirmed booking
    Given I have a confirmed booking
    When I cancel the booking
    Then I should see a cancellation confirmation
    And a refund should be initiated
    And the booking should no longer appear in my booking history


  @logoutSystem
  # Logout of SimplyBook.me system

  Scenario: Logging out after booking activities
    Given I am logged into my SimplyBook.me account
    When I click the logout button
    Then I should be redirected to the login or home page
    And I should no longer have access to the account dashboard