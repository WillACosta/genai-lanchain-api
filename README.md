## Gen-AI API with Langchain and NodeJS

This is an Express service written in [TypeScript](https://www.typescriptlang.org/) that provides authorization functionality and includes gen-AI features, using RAG concepts, vector database and implements AI memory history with Redis DB.

> 🌱 This project is under development.

## Resources

- [LangChain](https://js.langchain.com/docs/introduction/) for handling LLM and RAG functionality.
- [Express](https://expressjs.com/) and [Node](https://nodejs.org/en/) for creating backend service.
- [Qdrant](https://qdrant.tech/) as vector store database.
- [JWT](https://jwt.io/) for handling authentication
- [GoogleGenAI](https://v02.api.js.langchain.com/modules/_langchain_google_genai.html) langchain plugin.
- [Google Gemini - API](https://ai.google.dev/)
- [Docker](https://docs.docker.com/) Containers for setting up environment.
- [Redis](https://redis.io/) database for storing AI messages.

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

> Copy the `.env.example` file to `.env` and fill it with your own credentials

```shell
cp .env.example .env
```

2. You'll need [Docker](https://docs.docker.com/) to setup and running the application services

> From the app's root directory, run the following command to build and running docker containers:

```shell
docker compose up --build
```

> The application will be available at `http://localhost:3000`.
