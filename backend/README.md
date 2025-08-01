# SOP Financial Control System - Backend

This is the backend application for the SOP Financial Control System, built with SpringBoot and JPA.

## Requirements

- Java 11 or higher
- Maven
- PostgreSQL

## Setup

1. Configure the database connection in `src/main/resources/application.properties`

2. Run the database scripts in `src/main/resources/db/scripts.sql` to create the necessary tables

3. Build the application:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

5. The API will be available at [http://localhost:8080](http://localhost:8080)

## Project Structure

- `src/main/java/com/sop/financialcontrol/`
  - `controller/`: REST controllers
  - `dto/`: Data Transfer Objects
  - `model/`: Entity models
  - `repository/`: JPA repositories
  - `service/`: Business logic services
  - `exception/`: Custom exceptions and error handling
  - `config/`: Configuration classes

## API Endpoints

### Expenses
- `GET /api/expenses`: Get all expenses
- `GET /api/expenses/{id}`: Get expense by ID
- `POST /api/expenses`: Create a new expense
- `PUT /api/expenses/{id}`: Update an expense
- `DELETE /api/expenses/{id}`: Delete an expense

### Commitments
- `GET /api/commitments`: Get all commitments
- `GET /api/commitments/{id}`: Get commitment by ID
- `POST /api/commitments`: Create a new commitment
- `PUT /api/commitments/{id}`: Update a commitment
- `DELETE /api/commitments/{id}`: Delete a commitment

### Payments
- `GET /api/payments`: Get all payments
- `GET /api/payments/{id}`: Get payment by ID
- `POST /api/payments`: Create a new payment
- `PUT /api/payments/{id}`: Update a payment
- `DELETE /api/payments/{id}`: Delete a payment