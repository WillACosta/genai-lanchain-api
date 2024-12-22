## Gen-AI API with Langchain and NodeJS

This is an Express service written in [TypeScript](https://www.typescriptlang.org/) that provides authorization functionality and includes gen-AI features, using RAG concepts, vector database and implements AI memory history with Redis DB.

![Swagger UI screenshot](docs/docs-screenshot.jpeg 'Swagger UI screenshot')

## Resources

- [Express](https://expressjs.com/) and [Node](https://nodejs.org/en/) for creating backend service.
- [LangChain](https://js.langchain.com/docs/introduction/) for handling LLM and RAG functionality.
- [JWT](https://jwt.io/) for handling authentication
- [GoogleGenAI langchain](https://v02.api.js.langchain.com/modules/_langchain_google_genai.html) plugin.
- [Google Gemini - API](https://ai.google.dev/)
- [Docker](https://docs.docker.com/) containers for setting up environment.
- [Redis](https://redis.io/) database for storing AI messages.
- [ZOD](https://zod.dev/) as body parameters validation.
- [PostgreSQL](https://www.postgresql.org/) database for store user data
- [Prisma ORM](https://www.prisma.io/) for managing the database
- Automated [OpenAPI](https://www.openapis.org/what-is-openapi) specifications using [JsDocs](https://jsdoc.app/) and [Swagger UI](https://swagger.io/tools/swagger-ui/) for generating documentation.
- [Role-Based Access Control (RBAC)](https://www.redhat.com/en/topics/security/what-is-role-based-access-control) for managing API resources
- Rotate Logs using [Winston](https://github.com/winstonjs/winston)

## Project Structure

```yaml
common: common code and utilities for all modules
di: dependency injection container
modules: application features
  module_name:
    adapters: class adapters for external resources
      dataproviders:
      services:

    application: application layer for controllers and routes
      controllers:
      routes:

    core: application core logic
      entities:
      usecases:
      utils: class and constant utilities for this module
```

### Search In Document Flow

The search in document endpoint is the most complex of this application, it uses RAG concepts to break down the provided
PDF document into small chunks and use it as context to the follow-up questions. Also, it uses Redis to store
and retrieve chat history during user's session.

> A possible improvement, is to have a separated endpoint for uploading documents and another one for handling questions
> to it. For this initial version the endpoint accepts one document at a time and a question is needed, check this process on the diagram below:

![GenAI Search in Document Flow](docs/genai-flow.png 'GenAI Search in Document Flow')

## Prerequisites

Before running the application, make sure you have the following installed:

- NodeJS (v20.12.1)
- PNPM (v9.7.0)
- Docker (v27.2.0)

## Running the application

1. Clone this repository

```shell
git clone https://github.com/WillACosta/genai-langchain-api
```

> Copy the `.env.example` file to `.env` and fill it with your own credentials. Get here:
> [Google Gemini](https://ai.google.dev/) | [LangChain](https://js.langchain.com/docs/introduction/)

```shell
cp .env.example .env
```

2. You'll need [Docker](https://docs.docker.com/) to setup and running the application services

> From the app's root directory, run the following command to build and running docker containers:

```shell
make build
# or
make run
```

> The application will be available at `http://localhost:3000`.<br>For more commands see `Makefile`.

## Documentation

The documentation process is automated using `swagger-ui-express` and `swagger-jsdoc` libraries, on each application route definition you will find a comment with the necessary specifications for that route in particular.

During the build process the application will handle the route comments and generate the final `OpenApi` specification for the `Swagger UI`.

After that you will be able to access: `localhost:3000/docs` in your browser and see the docs.

> The application will be available at `http://localhost:3000`.

## Prisma ORM

This project uses Prisma ORM (Object-Relational Mapping), at every modifications related to the database schema,
a new migration is needed, create a new one running:

```shell
npx prisma migrate dev
```

After that generate a new prisma client instance with:

```shell
npx prisma generate
```

## Authenticating and RBAC

This project uses `jwt` for authenticating users and managing sessions. It also uses Role-Based Access Control to limit some aspects of the API, such as user management.

Current supported roles are: [`admin`, `user`]:

| Endpoint                       | Admin | User |
| ------------------------------ | ----- | ---- |
| GET users/                     | [x]   | [x]  |
| PATCH users/                   | [x]   | [x]  |
| PATCH users/change-role/:id    | [x]   |      |
| GET users/all                  | [x]   |      |
| DELETE users/:id               | [x]   |      |
| GET status/                    | [x]   | [x]  |
| POST /genai/translate          | [x]   | [x]  |
| POST /genai/search-in-document | [x]   | [x]  |
