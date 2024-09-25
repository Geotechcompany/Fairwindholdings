# Cita Trading Group Backend

## Overview

This is the backend service for Cita Trading Group, built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/). It provides RESTful API endpoints to support the Cita Trading Group frontend application, handling trading operations, user management, and data processing.

## Technologies

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Jest for testing
- Docker for containerization

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.x or higher)
- npm (version 8.x or higher)
- Docker (version 20.x or higher)
- PostgreSQL (version 13 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/cita-trading-group/backend.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration, including database credentials and API keys.

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start running on `http://localhost:3000` by default.

## API Documentation

API documentation is available at `/api-docs` when running the server locally. For production, refer to our [hosted API documentation](https://api-docs.citatradinggroup.com).

## Scripts

- `npm run dev`: Start the development server with hot-reloading
- `npm run build`: Build the TypeScript project
- `npm start`: Start the production server
- `npm test`: Run the test suite
- `npm run lint`: Lint the codebase
- `npm run migrate`: Run database migrations

## Database

Cita Trading Group uses PostgreSQL for data persistence. Our schema is managed using Prisma ORM. Refer to `./docs/database.md` for schema details and migration instructions.

## Testing

We use Jest for unit and integration tests. Run the test suite with:

```bash
npm test
```

## Deployment

Our backend is deployed using Docker containers on AWS ECS. Detailed deployment instructions can be found in `./docs/deployment.md`.

## Contributing

We welcome contributions to the Cita Trading Group backend. Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.

## Contact

For any queries regarding the backend, please contact the Cita Trading Group development team at dev@citatradinggroup.com.
