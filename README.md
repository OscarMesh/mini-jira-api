# Mini Jira Clone API

A NestJS-based REST API for a mini Jira clone application. This API provides endpoints for task management and user authentication.

## Features

- User authentication with JWT
- Task management (CRUD operations)
- Role-based access control
- PostgreSQL database with Prisma ORM
- Swagger API documentation
- Environment-based configuration

## Prerequisites

- Node.js (v20 or later)
- PostgreSQL (v14 or later)
- pnpm (v8 or later)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Application
APP_ENV=local
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mini_jira?schema=public"

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES=1d

# CORS
CLIENT_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Installation

```bash
# Install dependencies
$ pnpm install

# Generate Prisma client
$ pnpm prisma generate

# Run database migrations
$ pnpm prisma migrate deploy
```

## Running the Application

```bash
# Development
$ pnpm run start:dev

# Production
$ pnpm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/docs
```

## Hosted Server

The API is hosted and available at:

```
https://mini-jira-api.onrender.com
```

You can access the hosted API documentation at:

```
https://mini-jira-api.onrender.com/docs
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- Users
- Tasks

## Available Scripts

```bash
# Development
$ pnpm run start:dev

# Production
$ pnpm run start:prod

# Database migrations
$ pnpm run db:prod

# Testing
$ pnpm run test
$ pnpm run test:e2e
$ pnpm run test:cov

# Linting
$ pnpm run lint

# Formatting
$ pnpm run format
```

## Docker Support

The application includes a Dockerfile for containerization. To build and run with Docker:

```bash
# Build the image
$ docker build -t mini-jira-api .

# Run the container
$ docker run -p 3000:3000 mini-jira-api
```

## License

This project is [MIT licensed](LICENSE).
