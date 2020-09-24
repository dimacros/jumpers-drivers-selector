Feature: Assign a driver for an order
  Everybody wants to know when it's Friday

  Scenario: Order N° 1
    Given the available drivers:
      | Driver Name | Distance in minutes |
      | Driver 1    |          06         |
      | Driver 2    |          15         |
      | Driver 3    |          16         |
      | Driver 4    |          20         |
      | Driver 5    |          05         |
    When the job scheduler runs
    Then the job scheduler should choose the "Driver 1"

  Scenario: Order N° 2
    Given the available drivers:
      | Driver Name | Distance in minutes |
      | Driver 1    |          10         |
      | Driver 2    |          15         |
      | Driver 3    |          01         |
      | Driver 4    |          10         |
      | Driver 5    |          06         |
    When the job scheduler runs
    Then the job scheduler should choose the "Driver 3"

  Scenario: Order N° 3
    Given the available drivers:
      | Driver Name | Distance in minutes |
      | Driver 1    |          06         |
      | Driver 2    |          10         |
      | Driver 3    |          05         |
    When the job scheduler runs
    Then the job scheduler should choose the "Driver 1"
