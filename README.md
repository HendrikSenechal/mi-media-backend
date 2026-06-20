# Mi Media - Backend

## Team Members

- **Hendrik Senechal**  
  Email: hendrik.senechal@gmail.com 
  GitHub: [HendrikSenechal](https://github.com/HendrikSenechal)

------------------------------------------------------------------------

## Technologies Used

### Frontend
-   **React**
-   **Vite**

### Backend
-   **Node**
-   **NestJS CLI**

------------------------------------------------------------------------

## Installation instructions

1. Clone the repository

2. Open the project in:
   - VS Code

3. Make sure you have the following installed:
   - NestJS CLI
   - Docker Desktop

4. Install the dependencies:
   - pnpm install

5. Make sure Docker is running on your computer

6. Run the migrations and seeding with the following commands:
   - pnpm db:migrate
   - pnpm db:seed

7. Start the application with the following command (this also automatically runs `docker compose up -d`):
   - pnpm start:dev

------------------------------------------------------------------------

## Useful Commands

Start debug mode:

    pnpm start:debug

Run tests:

    test:e2e

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root of the project and configure the following variables:

### Application

| Variable       | Description                          | Example        |
|----------------|--------------------------------------|----------------|
| `NODE_ENV`     | Application environment              | `development`  |
| `PORT`         | Port on which the server runs        | `3000`         |

---

### CORS

| Variable           | Description                                      | Example                          |
|--------------------|--------------------------------------------------|----------------------------------|
| `CORS_ORIGINS`     | Allowed origins (JSON array as string)            | `["http://localhost:5173"]`      |
| `CORS_MAX_AGE`     | Cache duration for preflight requests (seconds)   | `10800`                          |

---

### Database

| Variable         | Description                  | Example |
|------------------|------------------------------|---------|
| `DATABASE_URL`   | MySQL connection string      | `mysql://devusr:devpwd@localhost:3307/sdp2-web ` |

---

### Authentication

| Variable            | Description                 | Example                                  |
|---------------------|-----------------------------|------------------------------------------|
| `AUTH_JWT_SECRET`   | Secret key for JWT signing  | `your-secret-key`                        |

---

### Large Language Model

| Variable            | Description                              | Example                                                                           |
|---------------------|------------------------------------------|-----------------------------------------------------------------------------------|
| `GROQ_API_KEY`      | Secret key for our chosen LLM framework  | `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`                        |

------------------------------------------------------------------------

## Authentication

### Users

TODO

### Roles

TODO

------------------------------------------------------------------------

## API endpoints

TODO

------------------------------------------------------------------------

## Overview of the solution structure

TODO