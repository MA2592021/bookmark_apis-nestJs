
---

# Bookmarks NestJS Project

## Overview

This is a NestJS application designed to handle an API for users Bookmarks . It is built with TypeScript and utilizes Prisma ORM with PostgreSQL for database management. The application is Dockerized for easy deployment and consistency across environments.

## Features

- User authentication using JWT
- Caching with cache-manager
- REST API endpoints
- Docker support for containerization

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org) (version 18 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, if using Docker Compose)

## Installation

### Clone the Repository

```bash
git clone https://github.com/MA2592021/bookmark_apis-nestJs.git
cd bookmark_apis-nestJs
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```env
DATABASE_URL="postgresql://postgres:123@localhost:5434/testNest?schema=public"
secret_key = "Super-secret"
exp_date = "15m"
```

## Running the Application

### Using Docker

1. **Build the Docker Image**

   ```bash
   docker build -t my-nest-app .
   ```

2. **Run the Docker Container**

   ```bash
   docker run -p 3000:3000 my-nest-app
   ```

   The application will be accessible at `http://localhost:3000`.

### Using Docker Compose (if applicable)

1. **Start the Application**

   ```bash
   docker-compose up
   ```

   This will start both the NestJS application and the PostgreSQL database.

### Using npm Commands

1. **Start the Application in Development Mode (shortcut)**

   ```bash
   npm run start:dev:root
   ```

   or

   ```bash
   npm run db:dev:up
   ```

2. **Migrate the Database**

   ```bash
   npm run db:dev:deploy
   ```

3. **Start the Application**

   ```bash
   npm run start:dev
   ```

   This will start the application in development mode, watching for changes and automatically restarting.

## Running Tests

To run the tests for the application, use:

```bash
npm test:e2e
```

## Caching

Caching is implemented using [cache-manager](https://www.npmjs.com/package/cache-manager). Configure caching behavior through environment variables and NestJS’s caching module.

## Code Style

- I use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for code formatting and linting.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Create a new Pull Request.

---

