Feature: Assign drivers to orders

  Background:
    Given the available orders:
      | Order N° | Restaurant              | Status | Latitude    | Longitude  |
      | Order 1  | Nativas Restobar        |    3   | -77.035793  | -11.908569 |
      | Order 2  | Nativas Restobar        |    3   | -77.035793  | -11.908569 |
      | Order 3  | Nativas Restobar        |    3   | -77.035793  | -11.908569 |

    Given the available drivers:
      | Driver Name | Place                   | Latitude   | Longitude  |
      | Driver 1    | Plaza Vea Comas         | -77.045618 | -11.932926 |
      | Driver 2    | El Abuelo Wanka         | -77.041820 | -11.917309 |
      | Driver 3    | Banco de la Nación      | -77.050534 | -11.945274 |
      | Driver 4    | Municipalidad de Comas  | -77.049251 | -11.957042 |
 
  Scenario: Choose Drivers
    When the job scheduler runs
    Then the job scheduler should choose the drivers:
      | Driver Name | Place                   | Latitude   | Longitude  |
      | Driver 2    | El Abuelo Wanka         | -77.041820 | -11.917309 |
      | Driver 1    | Plaza Vea Comas         | -77.045618 | -11.932926 |
